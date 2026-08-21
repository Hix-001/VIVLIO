import React from 'react';
import { ArrowLeft, BookOpen, Trash2, Calendar, FileText, User as UserIcon } from 'lucide-react';
import { useBookStore } from '../../store/bookStore';
import { useUIStore } from '../../store/uiStore';

export const BookDetails: React.FC = () => {
  const { books, activeBookId, deleteBook } = useBookStore();
  const { viewMode, setViewMode, isCoverOpen, setCoverOpen } = useUIStore();

  const isInspecting = viewMode === 'inspect';
  const activeBook = books.find((b) => b.id === activeBookId);

  if (!activeBook) return null;

  return (
    <aside
      className={`fixed top-0 right-0 bottom-0 w-[480px] max-w-full z-30 bg-[#241f1b]/95 backdrop-blur-2xl border-l border-[#e6d7c3]/20 shadow-2xl flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isInspecting ? 'translate-x-0' : 'translate-x-[105%]'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#e6d7c3]/15 flex justify-between items-center">
        <button
          onClick={() => {
            setCoverOpen(false);
            setViewMode('shelf');
          }}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-[#e6d7c3]/15 text-[#f5efe6] px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all"
        >
          <ArrowLeft size={14} />
          <span>Return to Shelf</span>
        </button>

        <span className="font-mono text-xs text-gold uppercase tracking-widest">
          {activeBook.year || '2026'}
        </span>
      </div>

      {/* Body Content */}
      <div className="p-8 overflow-y-auto flex-1 flex flex-col gap-6">
        <div>
          <h2 className="font-serifDisplay text-4xl text-[#f5efe6] leading-tight mb-2">
            {activeBook.title}
          </h2>
          <div className="font-serifBody italic text-xl text-[#c4b5a2]">
            {activeBook.author} &middot; {activeBook.subtitle}
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-black/30 border border-[#e6d7c3]/10">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-[#8e7f6e] tracking-widest flex items-center gap-1.5 mb-1">
              <UserIcon size={12} /> Author
            </span>
            <span className="text-sm font-medium text-[#f5efe6]">{activeBook.author}</span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-[#8e7f6e] tracking-widest flex items-center gap-1.5 mb-1">
              <FileText size={12} /> Extent
            </span>
            <span className="text-sm font-medium text-[#f5efe6]">
              {activeBook.pages ? `${activeBook.pages} pages` : 'Archival PDF'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-[#8e7f6e] tracking-widest flex items-center gap-1.5 mb-1">
              <Calendar size={12} /> Format
            </span>
            <span className="text-sm font-medium text-[#f5efe6]">PDF Source Document</span>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase text-[#8e7f6e] tracking-widest flex items-center gap-1.5 mb-1">
              Style
            </span>
            <span className="text-sm font-medium text-[#f5efe6]">Clothbound Hardcover</span>
          </div>
        </div>

        {/* Description */}
        <div className="font-serifBody text-lg leading-relaxed text-[#c4b5a2] flex-1">
          {activeBook.description || 'Personal archival edition rendered in interactive 3D cloth binding.'}
        </div>

        {/* Reading Controls Actions */}
        <div className="pt-4 border-t border-[#e6d7c3]/15 flex flex-col gap-3">
          <button
            onClick={() => setViewMode('reader')}
            className="w-full bg-[#d4af37] hover:bg-[#e5c26b] text-[#100f0d] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-sans tracking-wide transition-all transform hover:-translate-y-0.5 shadow-xl shadow-gold/20"
          >
            <BookOpen size={16} />
            <span>Open in Full 3D Reader</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setCoverOpen(!isCoverOpen)}
              className="bg-white/5 hover:bg-white/10 border border-[#e6d7c3]/15 text-[#f5efe6] py-2.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider transition-all"
            >
              {isCoverOpen ? 'Close Cover' : 'Inspect Cover'}
            </button>

            <button
              onClick={async () => {
                if (window.confirm(`Delete "${activeBook.title}" from library?`)) {
                  await deleteBook(activeBook.id);
                  setViewMode('shelf');
                }
              }}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 py-2.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 size={12} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
