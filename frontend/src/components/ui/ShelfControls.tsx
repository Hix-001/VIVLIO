import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookStore, DEFAULT_BOOKS } from '../../store/bookStore';
import { useUIStore } from '../../store/uiStore';

export const ShelfControls: React.FC = () => {
  const { books, activeBookId, shelfIndex, setShelfIndex, setActiveBookId } = useBookStore();
  const { viewMode, setViewMode } = useUIStore();

  const bookList = useMemo(() => {
    return Array.isArray(books) && books.length > 0 ? books : DEFAULT_BOOKS;
  }, [books]);

  if (viewMode !== 'shelf' || bookList.length === 0) return null;

  const normalizedIdx = ((shelfIndex % bookList.length) + bookList.length) % bookList.length;
  const activeBook = bookList[normalizedIdx] || bookList[0];

  return (
    <footer className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-4 pointer-events-none">
      {/* Active Volume Preview Banner */}
      <div
        onClick={() => setViewMode('inspect')}
        className="text-center max-w-xl pointer-events-auto cursor-pointer p-3 rounded-2xl hover:bg-white/[0.04] transition-all group"
      >
        <div className="font-mono text-[11px] tracking-widest uppercase text-gold mb-1">
          Volume {normalizedIdx + 1} of {bookList.length}
        </div>
        <h2 className="font-serifDisplay text-3xl tracking-wide text-[#f5efe6] leading-none mb-1 group-hover:text-gold transition-colors">
          {activeBook.title}
        </h2>
        <div className="font-serifBody italic text-base text-[#c4b5a2]">
          {activeBook.author} &middot; {activeBook.subtitle || 'Personal Edition'}
        </div>
      </div>

      {/* Carousel Navigation Toolbar */}
      <nav className="flex items-center gap-5 bg-[#1a1714]/85 backdrop-blur-xl border border-[#e6d7c3]/15 px-5 py-2.5 rounded-full pointer-events-auto shadow-2xl">
        <button
          onClick={() => setShelfIndex(shelfIndex - 1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#c4b5a2] hover:text-white hover:bg-white/10 transition-all"
          aria-label="Previous Volume"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Sliding Window Indicators for 101 Books */}
        <div className="flex items-center gap-1.5 px-2">
          <span className="font-mono text-xs text-gold font-bold mr-1.5">
            {normalizedIdx + 1}
          </span>
          <span className="font-mono text-xs text-[#8e7f6e] mr-2">
            / {bookList.length}
          </span>

          {/* Contextual mini-dots around active book */}
          {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
            const targetIdx = ((normalizedIdx + offset) % bookList.length + bookList.length) % bookList.length;
            const isCurr = offset === 0;
            return (
              <button
                key={offset}
                onClick={() => {
                  setShelfIndex(targetIdx);
                  setActiveBookId(bookList[targetIdx].id);
                }}
                className="p-0.5 group focus:outline-none"
                aria-label={`Jump to volume ${targetIdx + 1}`}
              >
                <div
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    isCurr
                      ? 'w-4 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]'
                      : 'w-1.5 bg-white/20 group-hover:bg-white/50'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShelfIndex(shelfIndex + 1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#c4b5a2] hover:text-white hover:bg-white/10 transition-all"
          aria-label="Next Volume"
        >
          <ChevronRight size={18} />
        </button>
      </nav>
    </footer>
  );
};
