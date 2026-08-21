import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

class PDFTextureManager {
  private docCache = new Map<string, any>();
  private canvasCache = new Map<string, HTMLCanvasElement>();

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

  async renderPageCanvas(pdfDoc: any, pdfUrl: string, pageNum: number, scale = 1.5): Promise<HTMLCanvasElement> {
    const key = `${pdfUrl}_p${pageNum}`;
    if (this.canvasCache.has(key)) {
      return this.canvasCache.get(key)!;
    }

    if (!pdfDoc || pageNum < 1 || pageNum > pdfDoc.numPages) {
      return this.createBlankPaperCanvas();
    }

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;

      // Archival paper background
      ctx.fillStyle = '#faf7f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;

      this.canvasCache.set(key, canvas);
      return canvas;
    } catch (err) {
      console.warn(`Error rendering page ${pageNum}:`, err);
      return this.createBlankPaperCanvas();
    }
  }

  createBlankPaperCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#f8f4eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
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
      leftCanvas = await this.renderPageCanvas(pdfDoc, pdfUrl, leftP);
      rightCanvas = await this.renderPageCanvas(pdfDoc, pdfUrl, rightP);
    }

    // Prefetch next spread in background
    if (pdfDoc && (spreadIndex + 1) * 2 <= totalPages + 1) {
      this.renderPageCanvas(pdfDoc, pdfUrl, (spreadIndex + 1) * 2);
      this.renderPageCanvas(pdfDoc, pdfUrl, (spreadIndex + 1) * 2 + 1);
    }

    return {
      leftCanvas,
      rightCanvas,
      totalPages,
      totalSpreads
    };
  }
}

export const pdfRenderer = new PDFTextureManager();
