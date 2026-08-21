import React from 'react';
import { BookOpen } from 'lucide-react';
import { Book } from '../../types';
import { useBookStore } from '../../store/bookStore';
import { useUIStore } from '../../store/uiStore';

export const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const { setActiveBookId } = useBookStore();
  const { setViewMode } = useUIStore();

  return (
    <div
      onClick={() => {
        setActiveBookId(book.id);
        setViewMode('inspect');
      }}
      className="group relative flex flex-col bg-[#1a1714]/80 border border-[#e6d7c3]/15 rounded-xl p-5 hover:border-gold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
    >
      {/* 2.5D Cover Thumbnail Miniature */}
      <div
        className="w-full aspect-[3/4] rounded-lg mb-4 flex flex-col justify-between p-4 shadow-xl border border-white/10 relative overflow-hidden"
        style={{
          backgroundColor: book.cloth_color || '#1a2238',
        }}
      >
        {/* Foil Border Miniature */}
        <div
          className="absolute inset-2 border border-white/20 rounded pointer-events-none"
          style={{ borderColor: book.foil_color || '#d4af37' }}
        />

        <span
          className="text-[9px] font-mono tracking-widest uppercase"
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
      </div>

      {/* Book Metadata */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serifDisplay text-xl text-[#f5efe6] group-hover:text-gold transition-colors line-clamp-1">
            {book.title}
          </h3>
          <p className="font-serifBody italic text-sm text-[#c4b5a2] line-clamp-1">
            {book.author}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#e6d7c3]/10 flex items-center justify-between text-xs font-mono text-[#8e7f6e]">
          <span>{book.pages ? `${book.pages} pp` : 'PDF'}</span>
          <span className="flex items-center gap-1 group-hover:text-gold transition-colors">
            <BookOpen size={12} /> Read &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
