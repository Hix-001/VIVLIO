import React, { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Download, Trash2, Calendar, FileText, Bookmark, Sparkles } from 'lucide-react';
import { useBookStore, DEFAULT_BOOKS } from '../../store/bookStore';
import { useUIStore } from '../../store/uiStore';

export const BookDetails: React.FC = () => {
  const { books, activeBookId, deleteBook } = useBookStore();
  const { viewMode, setViewMode, setCoverOpen } = useUIStore();
  const [imgError, setImgError] = useState(false);

  const isInspecting = viewMode === 'inspect';

  const bookList = useMemo(() => {
    return Array.isArray(books) && books.length > 0 ? books : DEFAULT_BOOKS;
  }, [books]);

  const activeBook = bookList.find((b) => b && b.id === activeBookId) || bookList[0];

  const handleDownload = () => {
    if (!activeBook) return;
    const pdfPath = activeBook.pdf_url || activeBook.file_path;
    if (pdfPath) {
      const link = document.createElement('a');
      link.href = pdfPath;
      link.download = `${activeBook.title} - ${activeBook.author}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
        {/* Cover Preview & Title */}
        <div className="flex gap-5 items-start">
          {activeBook.cover_url && !imgError ? (
            <div className="w-28 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-[#e6d7c3]/20 flex-shrink-0 bg-black/40">
              <img
                src={activeBook.cover_url}
                alt={activeBook.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-28 aspect-[2/3] rounded-lg shadow-2xl border border-white/20 p-2 flex flex-col justify-between flex-shrink-0"
              style={{ backgroundColor: activeBook.cloth_color }}
            >
              <span className="text-[8px] font-mono uppercase" style={{ color: activeBook.foil_color }}>
                {activeBook.year || '2026'}
              </span>
              <span className="text-[11px] font-serifDisplay leading-tight" style={{ color: activeBook.foil_color }}>
                {activeBook.title}
              </span>
            </div>
          )}

          <div className="flex-1">
            <span className="font-mono text-[10px] text-gold uppercase tracking-widest block mb-1">
              {activeBook.category || 'Masterpiece Edition'} &middot; {activeBook.year}
            </span>
            <h2 className="font-serifDisplay text-2xl text-[#f5efe6] leading-tight mb-1">
              {activeBook.title}
            </h2>
            <div className="font-serifBody italic text-base text-[#c4b5a2]">
              {activeBook.author}
            </div>
          </div>
        </div>

        {/* Action Buttons: Read Spread & Download */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setViewMode('reader')}
            className="py-3.5 px-4 rounded-xl bg-gold hover:bg-[#e5c26b] text-[#100f0d] font-bold flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-xl shadow-gold/20 tracking-wider uppercase text-xs font-mono"
          >
            <BookOpen size={15} strokeWidth={2.5} />
            <span>Open Reader</span>
          </button>

          <button
            onClick={handleDownload}
            className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-[#e6d7c3]/20 text-[#f5efe6] font-bold flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg tracking-wider uppercase text-xs font-mono"
          >
            <Download size={15} strokeWidth={2.5} />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Synopsis */}
        <div className="border-t border-[#e6d7c3]/10 pt-6">
          <h3 className="font-mono text-xs text-[#8e7f6e] uppercase tracking-wider mb-3">
            Synopsis & Notes
          </h3>
          <p className="font-serifBody text-[#c4b5a2] leading-relaxed text-sm">
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
            <span className="text-[#f5efe6]">{activeBook.total_pages || activeBook.pages || 'N/A'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#8e7f6e] flex items-center gap-2">
              <Bookmark size={13} /> Category
            </span>
            <span className="text-[#f5efe6]">{activeBook.category || 'Classics'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#8e7f6e] flex items-center gap-2">
              <Sparkles size={13} /> Binding & Foil
            </span>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: activeBook.cloth_color }}
                title="Cloth Hue"
              />
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: activeBook.foil_color }}
                title="Foil Accent"
              />
            </div>
          </div>

          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#8e7f6e] flex items-center gap-2">
              <Calendar size={13} /> Original Year
            </span>
            <span className="text-[#f5efe6]">{activeBook.year || 'Historic'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
