import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  Bookmark,
  Download,
  Maximize2,
  Minimize2,
  BookOpen,
  FileText,
  List,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useVaultStore } from '../../store/vaultStore';
import { pdfRenderer } from '../../lib/pdf-renderer';
import { sounds } from '../../lib/sound';

type ReaderTheme = 'parchment' | 'ivory' | 'obsidian';

export const OnlineReader: React.FC = () => {
  const { readingBook, isReaderOpen, closeReader, isAudioMuted, toggleAudio } = useVaultStore();

  const [currentSpread, setCurrentSpread] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSpreads, setTotalSpreads] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1.0);
  const [theme, setTheme] = useState<ReaderTheme>('ivory');
  const [viewMode, setViewMode] = useState<'spread' | 'single'>('spread');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showPageInput, setShowPageInput] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('');
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);

  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const isInitialLoad = useRef(true);

  // Restore saved reading progress from LocalStorage
  useEffect(() => {
    if (!readingBook || !isReaderOpen) {
      isInitialLoad.current = true;
      return;
    }

    try {
      const saved = localStorage.getItem(`vivlio_bookmark_${readingBook.id}`);
      if (saved) {
        const savedSpread = parseInt(saved, 10);
        if (!isNaN(savedSpread) && savedSpread > 0) {
          setCurrentSpread(savedSpread);
          setResumeNotice(`Resumed where you left off (Spread ${savedSpread + 1})`);
          setTimeout(() => setResumeNotice(null), 3500);
        } else {
          setCurrentSpread(0);
        }
      } else {
        setCurrentSpread(0);
      }
    } catch {
      setCurrentSpread(0);
    }
  }, [readingBook, isReaderOpen]);

  // Save reading progress to LocalStorage
  useEffect(() => {
    if (!readingBook || !isReaderOpen) return;
    try {
      localStorage.setItem(`vivlio_bookmark_${readingBook.id}`, currentSpread.toString());
    } catch {}
  }, [currentSpread, readingBook, isReaderOpen]);

  const handleClose = () => {
    if (readingBook) {
      pdfRenderer.cleanBookCanvases(readingBook.pdfUrl);
    }
    closeReader();
  };

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

  // Turn spread helper with audio feedback
  const goToSpread = (target: number) => {
    const clamped = Math.max(0, Math.min(totalSpreads - 1, target));
    if (clamped !== currentSpread) {
      sounds.playPaperTurn();
      setCurrentSpread(clamped);
    }
  };

  // Handle direct page jump submit
  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInputValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      // Calculate spread index from page number
      const targetSpread = page === 1 ? 0 : Math.floor(page / 2);
      goToSpread(targetSpread);
      setShowPageInput(false);
      setPageInputValue('');
    }
  };

  // Render spread when currentSpread changes with instant cache hit
  useEffect(() => {
    if (!readingBook || !isReaderOpen) return;

    let isMounted = true;
    const isCached = pdfRenderer.hasSpreadCached(readingBook.pdfUrl, currentSpread);

    // Only display spinner if not pre-rendered in background
    if (!isCached) {
      setIsLoading(true);
    }

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

  // Keyboard navigation: strictly A/D and ArrowUp/ArrowDown (no other keys)
  useEffect(() => {
    if (!isReaderOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (showPageInput) {
        if (e.key === 'Escape') setShowPageInput(false);
        return;
      }

      const key = e.key.toLowerCase();

      // Back: A or ArrowUp
      if (key === 'a' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToSpread(currentSpread - 1);
      }
      // Forth: D or ArrowDown
      else if (key === 'd' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToSpread(currentSpread + 1);
      }
      // Escape to return to sanctuary
      else if (e.key === 'Escape') {
        handleClose();
      }
      // Explicitly NO other keys move pages
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReaderOpen, currentSpread, totalSpreads, showPageInput, handleClose]);

  if (!isReaderOpen || !readingBook) return null;

  const leftPageNum = currentSpread === 0 ? 1 : currentSpread * 2;
  const rightPageNum = Math.min(totalPages, currentSpread * 2 + 1);
  const progressPercent = Math.round(((currentSpread + 1) / Math.max(1, totalSpreads)) * 100);

  const themeConfig = {
    parchment: {
      bg: 'bg-[#f4ecdc]',
      container: 'bg-[#f4ecd8] border-[#e2d4be]',
      spine: 'from-amber-950/20 via-amber-950/35 to-amber-950/20',
      headerBg: 'bg-[#ede3d1]/95 border-[#d9ccb6]',
      drawerBg: 'bg-[#ede3d1] border-[#d9ccb6]',
      text: 'text-[#382f25]',
      subtext: 'text-[#6b5a48]',
      pageBorder: 'border-[#d8c8af]',
    },
    ivory: {
      bg: 'bg-[#f7f5f0]',
      container: 'bg-[#ffffff] border-[#e7e3dc]',
      spine: 'from-black/15 via-black/25 to-black/15',
      headerBg: 'bg-white/95 border-[#e8e4dc]',
      drawerBg: 'bg-white border-[#e8e4dc]',
      text: 'text-[#1c1917]',
      subtext: 'text-[#78716c]',
      pageBorder: 'border-[#eae5dc]',
    },
    obsidian: {
      bg: 'bg-[#121113]',
      container: 'bg-[#1c1a1f] border-white/10 invert-[0.9] hue-rotate-180',
      spine: 'from-black/40 via-black/60 to-black/40',
      headerBg: 'bg-[#1a181d]/95 border-white/10',
      drawerBg: 'bg-[#1a181d] border-white/10',
      text: 'text-[#f5efe6]',
      subtext: 'text-[#a89885]',
      pageBorder: 'border-white/10',
    },
  };

  const currentT = themeConfig[theme];

  return (
    <div className={`fixed inset-0 z-[150] flex flex-col select-none ${currentT.bg} animate-fade-in`}>
      {/* Top Reading Progress Bar */}
      <div className="w-full h-1 bg-black/[0.06] overflow-hidden">
        <div
          className="h-full bg-[#c59b27] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ================= TOP READING HEADER ================= */}
      <header className={`px-4 sm:px-8 py-3 backdrop-blur-md border-b flex justify-between items-center z-20 ${currentT.headerBg}`}>
        {/* Left: Close, Thumbnails & Book Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="glass-pill flex items-center gap-1.5 px-3.5 py-1.5 text-neutral-800 text-xs font-sans font-medium tracking-wide transition-all shadow-glass cursor-pointer hover:scale-105"
            title="Return to 3D Library (Esc)"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Sanctuary</span>
          </button>

          {/* Quick Chapters / Spreads Drawer Toggle */}
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className={`p-2 rounded-full border transition-all ${
              showDrawer
                ? 'bg-[#c59b27] text-stone-950 border-[#c59b27]'
                : 'border-stone-300/80 hover:bg-stone-200/50 text-stone-700'
            }`}
            title="Spreads & Index Drawer"
          >
            <List size={14} />
          </button>

          <div className="hidden md:block">
            <h2 className="font-serif text-base text-stone-900 leading-tight">
              {readingBook.title}
            </h2>
            <span className="font-serif italic text-xs text-stone-600">
              {readingBook.author} &middot; {progressPercent}% Completed
            </span>
          </div>
        </div>

        {/* Center: Interactive Spread / Page Indicator */}
        <div className="relative">
          {showPageInput ? (
            <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={totalPages || readingBook.pageCount}
                value={pageInputValue}
                onChange={(e) => setPageInputValue(e.target.value)}
                placeholder={`1–${totalPages || readingBook.pageCount}`}
                autoFocus
                className="w-24 px-2 py-1 bg-white border border-[#c59b27] rounded-md text-xs font-mono text-stone-900 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-[#c59b27] text-stone-950 rounded-md text-xs font-mono font-bold"
              >
                Go
              </button>
              <button
                type="button"
                onClick={() => setShowPageInput(false)}
                className="p-1 text-stone-500 hover:text-stone-800"
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowPageInput(true)}
              className="flex items-center gap-2 font-mono text-xs text-stone-800 bg-black/[0.04] hover:bg-black/[0.08] px-4 py-1.5 rounded-full border border-stone-300/60 shadow-inner transition-colors"
              title="Click to Jump to Page"
            >
              <Bookmark size={13} className="text-[#c59b27]" />
              <span>
                {currentSpread === 0
                  ? 'Cover & Page 1'
                  : `Pages ${leftPageNum}–${rightPageNum} of ${totalPages || readingBook.pageCount}`}
              </span>
            </button>
          )}
        </div>

        {/* Right: View Mode, Theme, Zoom, Audio & Download */}
        <div className="flex items-center gap-2">
          {/* View Mode: Spread vs Single Page */}
          <div className="hidden lg:flex items-center bg-stone-200/60 p-0.5 rounded-full border border-stone-300/80">
            <button
              onClick={() => setViewMode('spread')}
              className={`p-1.5 rounded-full transition-all ${
                viewMode === 'spread' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
              title="Two-Page Spread (📖)"
            >
              <BookOpen size={13} />
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`p-1.5 rounded-full transition-all ${
                viewMode === 'single' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
              title="Single Page Mode (📄)"
            >
              <FileText size={13} />
            </button>
          </div>

          {/* Themes */}
          <div className="hidden sm:flex items-center bg-stone-200/60 p-0.5 rounded-full border border-stone-300/80">
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

          {/* Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full border border-stone-300/80 hover:bg-stone-200/50 text-stone-700 transition-colors"
            title={isAudioMuted ? 'Unmute Page Turn Sound' : 'Mute Sound'}
          >
            {isAudioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full border border-stone-300/80 hover:bg-stone-200/50 text-stone-700 transition-colors hidden sm:block"
            title="Toggle Fullscreen (F)"
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
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </header>

      {/* ================= RESUME TOAST NOTIFICATION ================= */}
      {resumeNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-stone-900/90 text-white text-xs font-mono px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border border-stone-700 animate-bounce">
          ✨ {resumeNotice}
        </div>
      )}

      {/* ================= MAIN CONTENT & SIDEBAR ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Slide-Out Spreads Drawer */}
        {showDrawer && (
          <aside className={`w-64 border-r z-30 p-4 overflow-y-auto flex flex-col gap-2 shadow-xl ${currentT.drawerBg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-stone-500 font-bold">
                Spreads ({totalSpreads})
              </span>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-full hover:bg-stone-200/50 text-stone-500"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: totalSpreads }).map((_, i) => {
                const isSelected = i === currentSpread;
                const pLeft = i === 0 ? 1 : i * 2;
                const pRight = Math.min(totalPages, i * 2 + 1);

                return (
                  <button
                    key={i}
                    onClick={() => {
                      goToSpread(i);
                      setShowDrawer(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-left font-mono text-xs transition-all ${
                      isSelected
                        ? 'bg-[#c59b27] text-stone-950 font-bold shadow-sm'
                        : 'hover:bg-black/[0.04] text-stone-700'
                    }`}
                  >
                    <span>{i === 0 ? 'Cover' : `Spread ${i + 1}`}</span>
                    <span className="opacity-60 text-[10px]">
                      {i === 0 ? 'p. 1' : `p. ${pLeft}–${pRight}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Viewport for Reading Canvas */}
        <main className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-900/15 backdrop-blur-sm z-30">
              <div className="flex items-center gap-3 bg-white/95 border border-stone-300 px-6 py-3 rounded-full text-xs font-mono text-stone-800 shadow-2xl">
                <Loader2 size={16} className="animate-spin text-[#c59b27]" />
                <span>Rendering High-Fidelity Spread...</span>
              </div>
            </div>
          )}

          {/* Hardcover Book Gutter Spread or Single Page */}
          <div
            className={`flex shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] rounded-sm overflow-hidden border transition-transform duration-300 relative ${currentT.container}`}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            {/* Central Gutter Spine Shadow & Crease (Spread Mode Only) */}
            {viewMode === 'spread' && (
              <div
                className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r pointer-events-none z-10 shadow-[inset_0_0_12px_rgba(0,0,0,0.3)] ${currentT.spine}`}
              />
            )}

            {/* Left Page (or Primary Single Page) */}
            <div className={`relative ${viewMode === 'spread' ? `border-r shadow-[inset_-25px_0_35px_rgba(0,0,0,0.06)] ${currentT.pageBorder}` : ''}`}>
              <canvas ref={leftCanvasRef} className="max-h-[75vh] w-auto block" />
            </div>

            {/* Right Page (Only in Spread Mode) */}
            {viewMode === 'spread' && (
              <div className="relative shadow-[inset_25px_0_35px_rgba(0,0,0,0.06)]">
                <canvas ref={rightCanvasRef} className="max-h-[75vh] w-auto block" />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ================= BOTTOM SPREAD SCRUBBER & NAVIGATION ================= */}
      <footer className={`px-4 sm:px-8 py-3 backdrop-blur-md border-t flex items-center justify-between gap-4 z-20 ${currentT.headerBg}`}>
        <button
          onClick={() => goToSpread(currentSpread - 1)}
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
            onChange={(e) => goToSpread(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-stone-300/70 rounded-lg appearance-none cursor-pointer accent-[#c59b27]"
          />
          <span className="font-mono text-xs text-stone-700 whitespace-nowrap min-w-[50px] text-right">
            {currentSpread + 1} / {totalSpreads}
          </span>
        </div>

        {/* Keyboard navigation indicator pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] text-[11px] font-mono text-stone-600 border border-stone-300/60 shadow-inner">
          <span><strong className="text-stone-900 font-bold">A / ↑</strong> Back</span>
          <span className="text-stone-300">&bull;</span>
          <span><strong className="text-stone-900 font-bold">D / ↓</strong> Forth</span>
        </div>

        <button
          onClick={() => goToSpread(currentSpread + 1)}
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
