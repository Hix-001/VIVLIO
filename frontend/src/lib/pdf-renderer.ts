import * as pdfjsLib from 'pdfjs-dist';

// Configure worker using cdnjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

class PDFTextureManager {
  private docCache = new Map<string, any>();
  private canvasCache = new Map<string, HTMLCanvasElement>();
  private canvasAccessOrder: string[] = [];
  private pendingPromises = new Map<string, Promise<HTMLCanvasElement>>();
  
  // Memory optimization: Strict LRU cap to keep memory usage under control
  private readonly MAX_CACHED_CANVASES = 22;

  async getDocument(pdfUrl: string) {
    if (this.docCache.has(pdfUrl)) {
      return this.docCache.get(pdfUrl);
    }
    try {
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
      });
      const pdfDoc = await loadingTask.promise;
      
      // Keep at most 2 active PDF documents in memory; destroy others
      if (this.docCache.size >= 2) {
        const oldestUrl = this.docCache.keys().next().value;
        if (oldestUrl && oldestUrl !== pdfUrl) {
          const oldDoc = this.docCache.get(oldestUrl);
          try { oldDoc?.destroy(); } catch {}
          this.docCache.delete(oldestUrl);
          this.cleanBookCanvases(oldestUrl);
        }
      }

      this.docCache.set(pdfUrl, pdfDoc);
      return pdfDoc;
    } catch (e) {
      console.warn(`Could not load PDF at ${pdfUrl}:`, e);
      return null;
    }
  }

  // Purge canvases of a specific book when no longer needed
  cleanBookCanvases(pdfUrl: string) {
    for (const key of Array.from(this.canvasCache.keys())) {
      if (key.startsWith(pdfUrl)) {
        const canvas = this.canvasCache.get(key);
        if (canvas) {
          // Immediately release underlying GPU framebuffer
          canvas.width = 0;
          canvas.height = 0;
        }
        this.canvasCache.delete(key);
        const idx = this.canvasAccessOrder.indexOf(key);
        if (idx !== -1) this.canvasAccessOrder.splice(idx, 1);
      }
    }
  }

  // LRU Store: inserts a canvas and discards oldest to prevent memory leakage
  private storeCanvas(key: string, canvas: HTMLCanvasElement) {
    // Evict oldest if exceeding capacity
    while (this.canvasCache.size >= this.MAX_CACHED_CANVASES && this.canvasAccessOrder.length > 0) {
      const oldestKey = this.canvasAccessOrder.shift();
      if (oldestKey && oldestKey !== key) {
        const oldCanvas = this.canvasCache.get(oldestKey);
        if (oldCanvas) {
          oldCanvas.width = 0;
          oldCanvas.height = 0;
        }
        this.canvasCache.delete(oldestKey);
      }
    }

    this.canvasCache.set(key, canvas);
    this.canvasAccessOrder.push(key);
  }

  private touchCanvas(key: string) {
    const idx = this.canvasAccessOrder.indexOf(key);
    if (idx !== -1) {
      this.canvasAccessOrder.splice(idx, 1);
      this.canvasAccessOrder.push(key);
    }
  }

  // Check if all pages for a spread are already cached in memory
  hasSpreadCached(pdfUrl: string, spreadIndex: number): boolean {
    const scale = 2.0;
    if (spreadIndex === 0) {
      return this.canvasCache.has(`${pdfUrl}_p1_s${scale}`);
    }
    const leftP = spreadIndex * 2;
    const rightP = spreadIndex * 2 + 1;
    return this.canvasCache.has(`${pdfUrl}_p${leftP}_s${scale}`) &&
           this.canvasCache.has(`${pdfUrl}_p${rightP}_s${scale}`);
  }

  async renderPageCanvas(pdfDoc: any, pdfUrl: string, pageNum: number, scale = 2.0): Promise<HTMLCanvasElement> {
    const key = `${pdfUrl}_p${pageNum}_s${scale}`;
    
    // 1. Instant LRU cache hit
    if (this.canvasCache.has(key)) {
      this.touchCanvas(key);
      return this.canvasCache.get(key)!;
    }

    // 2. Reuse pending render promise if already in flight
    if (this.pendingPromises.has(key)) {
      return this.pendingPromises.get(key)!;
    }

    if (!pdfDoc || pageNum < 1 || pageNum > pdfDoc.numPages) {
      const blank = this.createBlankPaperCanvas();
      this.storeCanvas(key, blank);
      return blank;
    }

    // 3. Initiate render promise
    const renderPromise = (async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;

        // Crisp archival paper background
        ctx.fillStyle = '#faf7f2';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        }).promise;

        this.storeCanvas(key, canvas);
        return canvas;
      } catch (err) {
        console.warn(`Error rendering page ${pageNum}:`, err);
        const fallback = this.createBlankPaperCanvas();
        this.storeCanvas(key, fallback);
        return fallback;
      } finally {
        this.pendingPromises.delete(key);
      }
    })();

    this.pendingPromises.set(key, renderPromise);
    return renderPromise;
  }

  createBlankPaperCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1700;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#f8f4eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
  }

  // Pre-render upcoming and preceding spreads quietly in the background
  async prefetchSpreads(pdfUrl: string, centerSpreadIndex: number, ahead = 3, behind = 1) {
    const pdfDoc = await this.getDocument(pdfUrl);
    if (!pdfDoc) return;

    const totalPages = pdfDoc.numPages;
    const totalSpreads = Math.max(1, Math.ceil((totalPages + 1) / 2));

    const prioritySpreads: number[] = [];
    for (let i = 1; i <= ahead; i++) {
      const nextIdx = centerSpreadIndex + i;
      if (nextIdx < totalSpreads) prioritySpreads.push(nextIdx);
    }
    for (let i = 1; i <= behind; i++) {
      const prevIdx = centerSpreadIndex - i;
      if (prevIdx >= 0) prioritySpreads.push(prevIdx);
    }

    for (const spread of prioritySpreads) {
      if (spread === 0) {
        this.renderPageCanvas(pdfDoc, pdfUrl, 1);
      } else {
        const left = spread * 2;
        const right = spread * 2 + 1;
        if (left <= totalPages) this.renderPageCanvas(pdfDoc, pdfUrl, left);
        if (right <= totalPages) this.renderPageCanvas(pdfDoc, pdfUrl, right);
      }
      await new Promise((r) => setTimeout(r, 20));
    }
  }

  async getSpread(pdfUrl: string, spreadIndex: number) {
    const pdfDoc = await this.getDocument(pdfUrl);
    const totalPages = pdfDoc ? pdfDoc.numPages : 0;
    const totalSpreads = Math.max(1, Math.ceil((totalPages + 1) / 2));

    let leftCanvas: HTMLCanvasElement;
    let rightCanvas: HTMLCanvasElement;

    if (spreadIndex === 0) {
      leftCanvas = this.createBlankPaperCanvas();
      rightCanvas = await this.renderPageCanvas(pdfDoc, pdfUrl, 1);
    } else {
      const leftP = spreadIndex * 2;
      const rightP = spreadIndex * 2 + 1;
      const [left, right] = await Promise.all([
        this.renderPageCanvas(pdfDoc, pdfUrl, leftP),
        this.renderPageCanvas(pdfDoc, pdfUrl, rightP),
      ]);
      leftCanvas = left;
      rightCanvas = right;
    }

    // Trigger prefetching with small radius
    this.prefetchSpreads(pdfUrl, spreadIndex, 3, 1);

    return {
      leftCanvas,
      rightCanvas,
      totalPages,
      totalSpreads,
    };
  }

  // Clear everything when exiting or low memory
  clearAll() {
    for (const canvas of Array.from(this.canvasCache.values())) {
      canvas.width = 0;
      canvas.height = 0;
    }
    this.canvasCache.clear();
    this.canvasAccessOrder = [];
    this.pendingPromises.clear();
  }
}

export const pdfRenderer = new PDFTextureManager();
