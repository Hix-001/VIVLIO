import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, Bookmark, Download, Maximize2, Minimize2 } from 'lucide-react';
import { useVaultStore } from '../../store/vaultStore';
import { pdfRenderer } from '../../lib/pdf-renderer';

type ReaderTheme = 'parchment' | 'ivory' | 'obsidian';

export const OnlineReader: React.FC = () => {
  const { readingBook, isReaderOpen, closeReader } = useVaultStore();

  const [currentSpread, setCurrentSpread] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSpreads, setTotalSpreads] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [theme, setTheme] = useState<ReaderTheme>('ivory');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  // Download original PDF
  const handleDownload = () => {
    if (!readingBook) return;
    const link = document.createElement('a');
    link.href = readingBook.pdfUrl;
    link.download = `${readingBook.title} - ${readingBook.author}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Render spread when currentSpread changes
  useEffect(() => {
    if (!readingBook || !isReaderOpen) return;

    let isMounted = true;
    setIsLoading(true);

    pdfRenderer.getSpread(readingBook.pdfUrl, currentSpread).then((spreadData) => {
      if (!isMounted) return;
      setTotalPages(spreadData.totalPages);
      setTotalSpreads(spreadData.totalSpreads);

      if (leftCanvasRef.current && spreadData.leftCanvas) {
        const leftCtx = leftCanvasRef.current.getContext('2d')!;
        leftCanvasRef.current.width = spreadData.leftCanvas.width;
        leftCanvasRef.current.height = spreadData.leftCanvas.height;
        leftCtx.drawImage(spreadData.leftCanvas, 0, 0);
      }

      if (rightCanvasRef.current && spreadData.rightCanvas) {
        const rightCtx = rightCanvasRef.current.getContext('2d')!;
        rightCanvasRef.current.width = spreadData.rightCanvas.width;
        rightCanvasRef.current.height = spreadData.rightCanvas.height;
        rightCtx.drawImage(spreadData.rightCanvas, 0, 0);
      }

      setIsLoading(false);
    }).catch((err) => {
      console.warn('PDF spread render failure:', err);
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [readingBook, currentSpread, isReaderOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isReaderOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        setCurrentSpread((prev) => Math.min(totalSpreads - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSpread((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        closeReader();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReaderOpen, totalSpreads, closeReader]);

  if (!isReaderOpen || !readingBook) return null;

  const leftPageNum = currentSpread === 0 ? 1 : currentSpread * 2;
  const rightPageNum = Math.min(totalPages, currentSpread * 2 + 1);

  const themeConfig = {
    parchment: {
      bg: 'bg-[#f5eee0]',
      container: 'bg-[#f4ecd8] border-[#e2d4be]',
      spine: 'from-amber-950/20 via-amber-950/35 to-amber-950/20',
      headerBg: 'bg-[#ede3d1]/90 border-[#d9ccb6]',
      text: 'text-[#382f25]',
      subtext: 'text-[#6b5a48]',
      pageBorder: 'border-[#d8c8af]',
    },
    ivory: {
      bg: 'bg-[#f7f5f0]',
      container: 'bg-[#ffffff] border-[#e7e3dc]',
      spine: 'from-black/15 via-black/25 to-black/15',
      headerBg: 'bg-white/90 border-[#e8e4dc]',
      text: 'text-[#1c1917]',
      subtext: 'text-[#78716c]',
      pageBorder: 'border-[#eae5dc]',
    },
    obsidian: {
      bg: 'bg-[#121113]',
      container: 'bg-[#1c1a1f] border-white/10 invert-[0.9] hue-rotate-180',
      spine: 'from-black/40 via-black/60 to-black/40',
      headerBg: 'bg-[#1a181d]/90 border-white/10',
      text: 'text-[#f5efe6]',
      subtext: 'text-[#a89885]',
      pageBorder: 'border-white/10',
    },
  };

  const currentT = themeConfig[theme];

  return (
    <div className={`fixed inset-0 z-[150] flex flex-col select-none ${currentT.bg} animate-fade-in`}>
      {/* ================= TOP READING HEADER ================= */}
      <header className={`px-6 sm:px-8 py-3.5 backdrop-blur-md border-b flex justify-between items-center z-20 ${currentT.headerBg}`}>
        {/* Left: Close & Book Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={closeReader}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-300/80 hover:bg-stone-200/50 text-stone-800 text-xs font-mono tracking-wider uppercase transition-all shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Return to Vault</span>
          </button>

          <div className="hidden sm:block">
            <h2 className="font-serif text-lg text-stone-900 leading-tight">
              {readingBook.title}
            </h2>
            <span className="font-serif italic text-xs text-stone-600">
              {readingBook.author} &middot; {readingBook.year}
            </span>
          </div>
        </div>

        {/* Center: Spread Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs text-stone-700 bg-black/[0.04] px-4 py-1.5 rounded-full border border-stone-300/60 shadow-inner">
          <Bookmark size={13} className="text-[#c59b27]" />
          <span>
            {currentSpread === 0
              ? 'Cover & Page 1'
              : `Pages ${leftPageNum}–${rightPageNum} of ${totalPages || readingBook.pageCount}`}
          </span>
        </div>

        {/* Right: Theme, Zoom, Fullscreen & Download */}
        <div className="flex items-center gap-2.5">
          {/* Themes */}
          <div className="hidden md:flex items-center bg-stone-200/60 p-0.5 rounded-full border border-stone-300/80">
            <button
              onClick={() => setTheme('ivory')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase transition-all ${
                theme === 'ivory' ? 'bg-white text-stone-900 font-bold shadow-sm' : 'text-stone-600'
              }`}
            >
              Ivory
            </button>
            <button
              onClick={() => setTheme('parchment')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase transition-all ${
                theme === 'parchment' ? 'bg-[#e8dcbf] text-amber-950 font-bold shadow-sm' : 'text-stone-600'
              }`}
            >
              Sepia
            </button>
            <button
              onClick={() => setTheme('obsidian')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase transition-all ${
                theme === 'obsidian' ? 'bg-stone-900 text-white font-bold shadow-sm' : 'text-stone-600'
              }`}
            >
              Night
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-stone-200/60 rounded-full px-2 py-1 border border-stone-300/80">
            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
              className="p-1 text-stone-700 hover:text-stone-950 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="font-mono text-[11px] text-stone-700 w-9 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
              className="p-1 text-stone-700 hover:text-stone-950 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full border border-stone-300/80 hover:bg-stone-200/50 text-stone-700 transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c59b27] hover:bg-[#d8ab32] text-stone-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-md"
            title="Download PDF"
          >
            <Download size={13} strokeWidth={2.5} />
            <span>PDF</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN TWO-PAGE SPREAD VIEWPORT ================= */}
      <main className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/20 backdrop-blur-sm z-30">
            <div className="flex items-center gap-3 bg-white/95 border border-stone-300 px-6 py-3 rounded-full text-xs font-mono text-stone-800 shadow-2xl">
              <Loader2 size={16} className="animate-spin text-[#c59b27]" />
              <span>Rendering Razor-Sharp Spread...</span>
            </div>
          </div>
        )}

        {/* Realistic Hardcover Book Gutter Spread */}
        <div
          className={`flex shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] rounded-sm overflow-hidden border transition-transform duration-300 relative ${currentT.container}`}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {/* Central Gutter Spine Shadow & Crease */}
          <div
            className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r pointer-events-none z-10 shadow-[inset_0_0_12px_rgba(0,0,0,0.3)] ${currentT.spine}`}
          />

          {/* Left Page */}
          <div className={`relative border-r shadow-[inset_-25px_0_35px_rgba(0,0,0,0.06)] ${currentT.pageBorder}`}>
            <canvas ref={leftCanvasRef} className="max-h-[75vh] w-auto block" />
          </div>

          {/* Right Page */}
          <div className="relative shadow-[inset_25px_0_35px_rgba(0,0,0,0.06)]">
            <canvas ref={rightCanvasRef} className="max-h-[75vh] w-auto block" />
          </div>
        </div>
      </main>

      {/* ================= BOTTOM SPREAD SCRUBBER ================= */}
      <footer className={`px-6 sm:px-8 py-3 backdrop-blur-md border-t flex items-center justify-between gap-6 z-20 ${currentT.headerBg}`}>
        <button
          onClick={() => setCurrentSpread((prev) => Math.max(0, prev - 1))}
          disabled={currentSpread === 0}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-stone-300/80 hover:bg-stone-200/50 disabled:opacity-30 text-stone-800 text-xs font-mono uppercase tracking-wider transition-all"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous Spread</span>
        </button>

        {/* Spread Range Slider */}
        <div className="flex-1 max-w-xl flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={Math.max(1, totalSpreads - 1)}
            value={currentSpread}
            onChange={(e) => setCurrentSpread(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-stone-300/70 rounded-lg appearance-none cursor-pointer accent-[#c59b27]"
          />
          <span className="font-mono text-xs text-stone-700 whitespace-nowrap">
            {currentSpread + 1} / {totalSpreads}
          </span>
        </div>

        <button
          onClick={() => setCurrentSpread((prev) => Math.min(totalSpreads - 1, prev + 1))}
          disabled={currentSpread >= totalSpreads - 1}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-stone-300/80 hover:bg-stone-200/50 disabled:opacity-30 text-stone-800 text-xs font-mono uppercase tracking-wider transition-all"
        >
          <span className="hidden sm:inline">Next Spread</span>
          <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
};

