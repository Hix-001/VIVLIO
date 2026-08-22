import React, { useMemo } from 'react';
import { ArrowLeft, BookOpen, Trash2, Calendar, FileText, User as UserIcon } from 'lucide-react';
import { useBookStore, DEFAULT_BOOKS } from '../../store/bookStore';
import { useUIStore } from '../../store/uiStore';

export const BookDetails: React.FC = () => {
  const { books, activeBookId, deleteBook } = useBookStore();
  const { viewMode, setViewMode, isCoverOpen, setCoverOpen } = useUIStore();

  const isInspecting = viewMode === 'inspect';

  const bookList = useMemo(() => {
    return Array.isArray(books) && books.length > 0 ? books : DEFAULT_BOOKS;
  }, [books]);

  const activeBook = bookList.find((b) => b && b.id === activeBookId) || bookList[0];

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

        <button
          onClick={() => deleteBook(activeBook.id)}
          className="p-2 text-[#8e7f6e] hover:text-red-400 transition-colors"
          title="Delete Volume"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Book Metadata Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <div>
          <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-2">
            Archival Clothbound Edition
          </span>
          <h2 className="font-serifDisplay text-4xl text-[#f5efe6] leading-tight mb-2">
            {activeBook.title}
          </h2>
          <div className="font-serifBody italic text-xl text-[#c4b5a2]">
            {activeBook.author}
          </div>
        </div>

        {/* Action Button: Read Spread */}
        <button
          onClick={() => setViewMode('reader')}
          className="w-full py-4 rounded-xl bg-gold hover:bg-[#e5c26b] text-[#100f0d] font-bold flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-gold/20 tracking-wider uppercase text-xs font-mono"
        >
          <BookOpen size={16} strokeWidth={2.5} />
          <span>Open Two-Page Spread</span>
        </button>

        {/* Synopsis */}
        <div className="border-t border-[#e6d7c3]/10 pt-6">
          <h3 className="font-mono text-xs text-[#8e7f6e] uppercase tracking-wider mb-3">
            Synopsis & Notes
          </h3>
          <p className="font-serifBody text-[#c4b5a2] leading-relaxed text-base">
            {activeBook.description || 'No description available for this volume.'}
          </p>
        </div>

        {/* Spec Sheet */}
        <div className="border-t border-[#e6d7c3]/10 pt-6 space-y-3 font-mono text-xs">
          <h3 className="text-[#8e7f6e] uppercase tracking-wider mb-3">Specifications</h3>
          
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#8e7f6e] flex items-center gap-2">
              <FileText size={13} /> Pages
            </span>
            <span className="text-[#f5efe6]">{activeBook.total_pages || 'N/A'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#8e7f6e] flex items-center gap-2">
              <UserIcon size={13} /> Cloth Color
            </span>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: activeBook.cloth_color }}
              />
              <span className="text-[#f5efe6]">{activeBook.cloth_color}</span>
            </div>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#8e7f6e] flex items-center gap-2">
              <Calendar size={13} /> Foil Accent
            </span>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: activeBook.foil_color }}
              />
              <span className="text-[#f5efe6]">{activeBook.foil_color}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
