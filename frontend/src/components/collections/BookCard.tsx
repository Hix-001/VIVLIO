import React, { useState } from 'react';
import { BookOpen, Download } from 'lucide-react';
import { Book } from '../../types';
import { useBookStore } from '../../store/bookStore';
import { useUIStore } from '../../store/uiStore';

export const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const { setActiveBookId } = useBookStore();
  const { setViewMode } = useUIStore();
  const [imgError, setImgError] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const pdfPath = book.pdf_url || book.file_path;
    if (pdfPath) {
      const link = document.createElement('a');
      link.href = pdfPath;
      link.download = `${book.title} - ${book.author}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveBookId(book.id);
    setViewMode('reader');
  };

  return (
    <div
      onClick={() => {
        setActiveBookId(book.id);
        setViewMode('inspect');
      }}
      className="group relative flex flex-col bg-[#1a1714]/80 border border-[#e6d7c3]/15 rounded-xl p-4 hover:border-gold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
    >
      {/* 2.5D Cover Thumbnail Miniature */}
      <div
        className="w-full aspect-[3/4] rounded-lg mb-4 flex flex-col justify-between p-4 shadow-xl border border-white/10 relative overflow-hidden group/thumb"
        style={{
          backgroundColor: book.cloth_color || '#1a2238',
        }}
      >
        {/* Real Cover Image if available */}
        {book.cover_url && !imgError ? (
          <img
            src={book.cover_url}
            alt={book.title}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <>
            {/* Foil Border Miniature Fallback */}
            <div
              className="absolute inset-2 border border-white/20 rounded pointer-events-none"
              style={{ borderColor: book.foil_color || '#d4af37' }}
            />

            <span
              className="text-[9px] font-mono tracking-widest uppercase z-10"
              style={{ color: book.foil_color || '#d4af37' }}
            >
              {book.year || '2026'}
            </span>

            <div className="z-10">
              <h4
                className="font-serifDisplay text-lg font-normal leading-tight uppercase line-clamp-2"
                style={{ color: book.foil_color || '#d4af37' }}
              >
                {book.title}
              </h4>
              <span className="font-serifBody italic text-xs text-white/80 line-clamp-1 mt-1 block">
                {book.author}
              </span>
            </div>
          </>
        )}

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4 z-20">
          <button
            onClick={handleRead}
            className="px-3 py-2 rounded-full bg-gold hover:bg-[#e5c26b] text-[#100f0d] font-bold text-xs font-mono uppercase flex items-center gap-1.5 shadow-lg transform hover:scale-105 transition-all"
            title="Read Volume"
          >
            <BookOpen size={13} />
            <span>Read</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all shadow-lg transform hover:scale-105"
            title="Download PDF"
          >
            <Download size={14} />
          </button>
        </div>

        {/* Category Pill */}
        {book.category && (
          <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-[#d4af37] border border-white/10 z-10">
            {book.category}
          </span>
        )}
      </div>

      {/* Book Metadata */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serifDisplay text-lg text-[#f5efe6] group-hover:text-gold transition-colors line-clamp-1">
            {book.title}
          </h3>
          <p className="font-serifBody italic text-xs text-[#c4b5a2] line-clamp-1 mt-0.5">
            {book.author}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#e6d7c3]/10 flex items-center justify-between text-xs font-mono text-[#8e7f6e]">
          <span>{book.pages ? `${book.pages} pp` : 'PDF'}</span>
          <span className="flex items-center gap-1 group-hover:text-gold transition-colors">
            Inspect &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
