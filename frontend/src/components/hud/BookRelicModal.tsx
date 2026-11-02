import React from 'react';
import { X, BookOpen, Download, Bookmark, Sparkles, ExternalLink } from 'lucide-react';
import { useVaultStore } from '../../store/vaultStore';

export const BookRelicModal: React.FC = () => {
  const { inspectedBook, setInspectedBook } = useVaultStore();

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md select-none animate-fade-in"
      onClick={() => setInspectedBook(null)}
    >
      {/* Monastic Relic Inspection Card */}
      <div
        className="relative w-full max-w-2xl bg-[#121115]/95 border border-[#c59b27]/30 rounded-2xl p-6 sm:p-8 text-[#f5efe6] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col sm:flex-row gap-6 items-center sm:items-start"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: `0 0 40px ${inspectedBook.accentHue}22, inset 0 0 20px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Corner Cybernetic Crosshair Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#c59b27]/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#c59b27]/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#c59b27]/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#c59b27]/60 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setInspectedBook(null)}
          className="absolute top-4 right-4 p-2 rounded-full text-[#c4b5a2] hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <X size={18} />
        </button>

        {/* Relic Cover Artwork Miniature */}
        <div className="w-40 sm:w-48 aspect-[3/4.4] rounded-lg overflow-hidden shadow-2xl border border-[#c59b27]/30 flex-shrink-0 bg-black/60 relative group">
          <img
            src={inspectedBook.coverImage}
            alt={inspectedBook.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Neon Hue Tint Sheen */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: `linear-gradient(135deg, ${inspectedBook.accentHue} 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Metadata Details Column */}
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            {/* Sector / Rune Tag */}
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px] tracking-widest uppercase">
              <span
                className="px-2 py-0.5 rounded border"
                style={{
                  color: inspectedBook.accentHue,
                  borderColor: `${inspectedBook.accentHue}44`,
                  background: `${inspectedBook.accentHue}11`,
                }}
              >
                {inspectedBook.runeGlyph}
              </span>
              <span className="text-[#8e7f6e]">&middot;</span>
              <span className="text-[#c4b5a2]">{inspectedBook.category}</span>
            </div>

            {/* Title & Author */}
            <h2 className="font-serif text-3xl text-[#f5efe6] font-normal leading-tight mb-1">
              {inspectedBook.title}
            </h2>
            <p className="font-serif italic text-base text-[#c4b5a2] mb-4">
              {inspectedBook.author} &middot; {inspectedBook.year}
            </p>

            {/* Synopsis */}
            <p className="font-sans text-xs sm:text-sm text-[#a89885] leading-relaxed mb-6">
              {inspectedBook.description}
            </p>

            {/* Spec Badges */}
            <div className="grid grid-cols-2 gap-2 mb-6 font-mono text-[11px] text-[#8e7f6e] border-t border-b border-white/10 py-3">
              <div>
                <span className="block text-white/40 uppercase text-[9px]">Length</span>
                <span className="text-[#e6d7c3]">{inspectedBook.pageCount} Pages</span>
              </div>
              <div>
                <span className="block text-white/40 uppercase text-[9px]">Classification</span>
                <span className="text-[#e6d7c3]">{inspectedBook.category}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Read & Download */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={inspectedBook.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 text-[#0a090b]"
              style={{
                backgroundColor: inspectedBook.accentHue,
                boxShadow: `0 0 20px ${inspectedBook.accentHue}55`,
              }}
            >
              <BookOpen size={14} />
              <span>Read Full PDF</span>
            </a>

            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-[#f5efe6] font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
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
