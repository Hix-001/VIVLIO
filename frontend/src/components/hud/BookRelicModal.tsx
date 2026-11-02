import React from 'react';
import { X, BookOpen, Download, Bookmark } from 'lucide-react';
import { useVaultStore } from '../../store/vaultStore';

export const BookRelicModal: React.FC = () => {
  const { inspectedBook, setInspectedBook, openReader } = useVaultStore();

  if (!inspectedBook) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = inspectedBook.pdfUrl;
    link.download = `${inspectedBook.title} - ${inspectedBook.author}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-stone-900/35 backdrop-blur-md select-none animate-fade-in"
      onClick={() => setInspectedBook(null)}
    >
      {/* Light Mode Luxury Relic Inspection Card */}
      <div
        className="relative w-full max-w-2xl bg-white/95 border border-stone-200/90 rounded-2xl p-6 sm:p-8 text-stone-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col sm:flex-row gap-6 items-center sm:items-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Brass Trim Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#c59b27]/70 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#c59b27]/70 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#c59b27]/70 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#c59b27]/70 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setInspectedBook(null)}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors z-20"
        >
          <X size={18} />
        </button>

        {/* Relic Cover Artwork Miniature */}
        <div className="w-40 sm:w-48 aspect-[3/4.4] rounded-lg overflow-hidden shadow-xl border border-stone-200 flex-shrink-0 bg-stone-100 relative group">
          <img
            src={inspectedBook.coverImage}
            alt={inspectedBook.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Metadata Details Column */}
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            {/* Category Tag */}
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px] tracking-widest uppercase">
              <span className="px-2.5 py-0.5 rounded-full border border-[#c59b27]/40 bg-[#c59b27]/10 text-[#8e6b12] font-semibold">
                {inspectedBook.category}
              </span>
              <span className="text-stone-300">&middot;</span>
              <span className="text-stone-500">{inspectedBook.runeGlyph}</span>
            </div>

            {/* Title & Author */}
            <h2 className="font-serif text-3xl text-stone-900 font-normal leading-tight mb-1">
              {inspectedBook.title}
            </h2>
            <p className="font-serif italic text-base text-stone-600 mb-4">
              {inspectedBook.author} &middot; {inspectedBook.year}
            </p>

            {/* Synopsis */}
            <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              {inspectedBook.description}
            </p>

            {/* Spec Badges */}
            <div className="grid grid-cols-2 gap-2 mb-6 font-mono text-[11px] text-stone-600 border-t border-b border-stone-200 py-3">
              <div>
                <span className="block text-stone-400 uppercase text-[9px]">Length</span>
                <span className="text-stone-800 font-semibold">{inspectedBook.pageCount} Pages</span>
              </div>
              <div>
                <span className="block text-stone-400 uppercase text-[9px]">Binding</span>
                <span className="text-stone-800 font-semibold">Archival Edition</span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Read Inside App & Download */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openReader(inspectedBook)}
              className="px-5 py-2.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 bg-[#c59b27] hover:bg-[#d8ab32] text-stone-950"
            >
              <BookOpen size={14} />
              <span>Open Online Reader</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-full border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
