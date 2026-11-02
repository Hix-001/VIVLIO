import * as pdfjsLib from 'pdfjs-dist';

// Configure worker using cdnjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

class PDFTextureManager {
  private docCache = new Map<string, any>();
  private canvasCache = new Map<string, HTMLCanvasElement>();
  private pendingPromises = new Map<string, Promise<HTMLCanvasElement>>();

  async getDocument(pdfUrl: string) {
    if (this.docCache.has(pdfUrl)) {
      return this.docCache.get(pdfUrl);
    }
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdfDoc = await loadingTask.promise;
      this.docCache.set(pdfUrl, pdfDoc);
      return pdfDoc;
    } catch (e) {
      console.warn(`Could not load PDF at ${pdfUrl}:`, e);
      return null;
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
    
    // 1. Instant cache hit
    if (this.canvasCache.has(key)) {
      return this.canvasCache.get(key)!;
    }

    // 2. Reuse pending render promise if already in flight
    if (this.pendingPromises.has(key)) {
      return this.pendingPromises.get(key)!;
    }

    if (!pdfDoc || pageNum < 1 || pageNum > pdfDoc.numPages) {
      const blank = this.createBlankPaperCanvas();
      this.canvasCache.set(key, blank);
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

        this.canvasCache.set(key, canvas);
        return canvas;
      } catch (err) {
        console.warn(`Error rendering page ${pageNum}:`, err);
        const fallback = this.createBlankPaperCanvas();
        this.canvasCache.set(key, fallback);
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
  async prefetchSpreads(pdfUrl: string, centerSpreadIndex: number, ahead = 4, behind = 2) {
    const pdfDoc = await this.getDocument(pdfUrl);
    if (!pdfDoc) return;

    const totalPages = pdfDoc.numPages;
    const totalSpreads = Math.max(1, Math.ceil((totalPages + 1) / 2));

    // Order of priority: next spread, 2nd next, previous spread, etc.
    const prioritySpreads: number[] = [];
    for (let i = 1; i <= ahead; i++) {
      const nextIdx = centerSpreadIndex + i;
      if (nextIdx < totalSpreads) prioritySpreads.push(nextIdx);
    }
    for (let i = 1; i <= behind; i++) {
      const prevIdx = centerSpreadIndex - i;
      if (prevIdx >= 0) prioritySpreads.push(prevIdx);
    }

    // Background prefetching queue with slight stagger to keep UI silky smooth
    for (const spread of prioritySpreads) {
      if (spread === 0) {
        this.renderPageCanvas(pdfDoc, pdfUrl, 1);
      } else {
        const left = spread * 2;
        const right = spread * 2 + 1;
        if (left <= totalPages) this.renderPageCanvas(pdfDoc, pdfUrl, left);
        if (right <= totalPages) this.renderPageCanvas(pdfDoc, pdfUrl, right);
      }
      // Micro-pause to yield thread to browser rendering
      await new Promise((r) => setTimeout(r, 16));
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

    // Immediately trigger background prefetch for seamless next/prev page turns
    this.prefetchSpreads(pdfUrl, spreadIndex, 4, 2);

    return {
      leftCanvas,
      rightCanvas,
      totalPages,
      totalSpreads,
    };
  }
}

export const pdfRenderer = new PDFTextureManager();
