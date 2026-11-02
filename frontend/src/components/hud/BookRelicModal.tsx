import React from 'react';
import { X, BookOpen, Download, Sparkles } from 'lucide-react';
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-stone-900/25 backdrop-blur-xl select-none animate-fade-in font-sans"
      onClick={() => setInspectedBook(null)}
    >
      {/* Frosted Glass Luxury Relic Inspection Card */}
      <div
        className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-9 text-neutral-900 shadow-glass flex flex-col sm:flex-row gap-7 items-center sm:items-start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setInspectedBook(null)}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/50 transition-colors z-20 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Relic Cover Artwork Miniature */}
        <div className="w-40 sm:w-52 aspect-[3/4.4] rounded-2xl overflow-hidden shadow-xl border border-white/90 flex-shrink-0 bg-stone-100 relative group">
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
            <div className="inline-flex items-center gap-1.5 glass-pill px-3 py-1 mb-3 shadow-xs">
              <Sparkles size={11} className="text-[#c59b27]" />
              <span className="text-[10px] font-sans font-semibold tracking-wider uppercase text-neutral-700">
                {inspectedBook.category} &middot; {inspectedBook.runeGlyph}
              </span>
            </div>

            {/* Title & Author in Apple's New York Serif */}
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 font-light tracking-tight leading-tight mb-1">
              {inspectedBook.title}
            </h2>
            <p className="font-serif italic text-base sm:text-lg text-[#8d6a1b] font-normal mb-4">
              {inspectedBook.author} &mdash; {inspectedBook.year}
            </p>

            {/* Synopsis in Apple's San Francisco Sans */}
            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed mb-6">
              {inspectedBook.description}
            </p>

            {/* Spec Badges */}
            <div className="grid grid-cols-2 gap-3 mb-6 font-sans text-xs text-neutral-600 border-t border-b border-neutral-200/80 py-3">
              <div>
                <span className="block text-neutral-400 uppercase text-[10px] font-medium">Extent</span>
                <span className="text-neutral-900 font-semibold">{inspectedBook.pageCount} Pages</span>
              </div>
              <div>
                <span className="block text-neutral-400 uppercase text-[10px] font-medium">Edition</span>
                <span className="text-neutral-900 font-semibold">Archival Hardcover</span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Read Inside App & Download */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openReader(inspectedBook)}
              className="px-6 py-2.5 rounded-full font-sans font-semibold text-xs tracking-wider uppercase flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 bg-[#c59b27] hover:bg-[#d8ab32] text-neutral-950 cursor-pointer"
            >
              <BookOpen size={14} strokeWidth={2.4} />
              <span>Open Online Reader</span>
            </button>

            <button
              onClick={handleDownload}
              className="glass-pill px-4 py-2.5 rounded-full font-sans font-medium text-xs tracking-wider text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 transition-all cursor-pointer shadow-glass"
              title="Download Original PDF"
            >
              <Download size={13} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
