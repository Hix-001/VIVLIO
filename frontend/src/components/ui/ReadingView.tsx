import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, Bookmark } from 'lucide-react';
import { useBookStore, DEFAULT_BOOKS } from '../../store/bookStore';
import { useUIStore } from '../../store/uiStore';
import { pdfRenderer } from '../../lib/pdf-renderer';

export const ReadingView: React.FC = () => {
  const { books, activeBookId, updateReadingProgress } = useBookStore();
  const { viewMode, setViewMode } = useUIStore();

  const bookList = useMemo(() => {
    return Array.isArray(books) && books.length > 0 ? books : DEFAULT_BOOKS;
  }, [books]);

  const activeBook = bookList.find((b) => b && b.id === activeBookId) || bookList[0];

  const [currentSpread, setCurrentSpread] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSpreads, setTotalSpreads] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1.0);

  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!activeBook || viewMode !== 'reader') return;

    let isMounted = true;
    setIsLoading(true);

    const pdfUrl = activeBook.pdf_url || activeBook.file_path;
    pdfRenderer.getSpread(pdfUrl, currentSpread).then((spreadData) => {
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

      // Save reading progress
      const leftP = currentSpread === 0 ? 1 : currentSpread * 2;
      updateReadingProgress(activeBook.id, {
        last_page: leftP,
        last_spread: currentSpread,
        total_pages: spreadData.totalPages,
      });
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [activeBook, currentSpread, viewMode]);

  // Keyboard navigation
  useEffect(() => {
    if (viewMode !== 'reader') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        setCurrentSpread((prev) => Math.min(totalSpreads - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSpread((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        setViewMode('inspect');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, totalSpreads]);

  if (viewMode !== 'reader' || !activeBook) return null;

  const leftPageNum = currentSpread === 0 ? 1 : currentSpread * 2;
  const rightPageNum = Math.min(totalPages, currentSpread * 2 + 1);

  return (
    <div className="fixed inset-0 z-40 bg-[#12100e] flex flex-col select-none animate-fade-in">
      {/* Top Reading Header */}
      <header className="px-8 py-4 bg-[#1a1714]/90 backdrop-blur-md border-b border-[#e6d7c3]/15 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode('inspect')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-[#e6d7c3]/15 text-[#f5efe6] px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all"
          >
            <ArrowLeft size={14} />
            <span>Close Reader</span>
          </button>

          <div>
            <h2 className="font-serifDisplay text-xl text-[#f5efe6]">{activeBook.title}</h2>
            <span className="font-serifBody italic text-xs text-[#c4b5a2]">{activeBook.author}</span>
          </div>
        </div>

        {/* Center Spread Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#c4b5a2]">
          <Bookmark size={14} className="text-gold" />
          <span>
            {currentSpread === 0
              ? 'Front Endpaper & Page 1'
              : `Pages ${leftPageNum}–${rightPageNum} of ${totalPages}`}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-[#e6d7c3]/15 flex items-center justify-center text-[#c4b5a2] hover:text-white transition-all"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="font-mono text-xs text-[#8e7f6e] w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-[#e6d7c3]/15 flex items-center justify-center text-[#c4b5a2] hover:text-white transition-all"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </header>

      {/* Main Two-Page Spread Canvas Viewport */}
      <main className="flex-1 overflow-auto flex items-center justify-center p-6 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
            <div className="flex items-center gap-3 bg-[#1a1714] border border-gold/30 px-6 py-3 rounded-full text-xs font-mono text-gold shadow-2xl">
              <Loader2 size={16} className="animate-spin" />
              <span>Rendering PDF pages...</span>
            </div>
          </div>
        )}

        {/* Two-page book spread container */}
        <div
          className="flex shadow-2xl rounded-sm overflow-hidden bg-[#faf7f0] border border-[#e6d7c3]/30 transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          {/* Left Page */}
          <div className="relative border-r border-[#d8cbb7] shadow-[inset_-15px_0_20px_rgba(0,0,0,0.06)]">
            <canvas ref={leftCanvasRef} className="max-h-[78vh] w-auto block" />
          </div>

          {/* Right Page */}
          <div className="relative shadow-[inset_15px_0_20px_rgba(0,0,0,0.06)]">
            <canvas ref={rightCanvasRef} className="max-h-[78vh] w-auto block" />
          </div>
        </div>
      </main>

      {/* Bottom Spread Navigation & Slider */}
      <footer className="px-8 py-4 bg-[#1a1714]/90 backdrop-blur-md border-t border-[#e6d7c3]/15 flex items-center justify-between gap-6 z-10">
        <button
          onClick={() => setCurrentSpread((prev) => Math.max(0, prev - 1))}
          disabled={currentSpread === 0}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-[#e6d7c3]/15 text-[#f5efe6] px-5 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all"
        >
          <ChevronLeft size={16} />
          <span>Previous Spread</span>
        </button>

        {/* Spread Range Slider */}
        <div className="flex-1 max-w-xl flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={Math.max(1, totalSpreads - 1)}
            value={currentSpread}
            onChange={(e) => setCurrentSpread(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gold"
          />
          <span className="font-mono text-xs text-[#c4b5a2] whitespace-nowrap">
            Spread {currentSpread + 1} / {totalSpreads}
          </span>
        </div>

        <button
          onClick={() => setCurrentSpread((prev) => Math.min(totalSpreads - 1, prev + 1))}
          disabled={currentSpread >= totalSpreads - 1}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-[#e6d7c3]/15 text-[#f5efe6] px-5 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all"
        >
          <span>Next Spread</span>
          <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
};
