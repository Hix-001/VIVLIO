import React from 'react';
import { Search, X } from 'lucide-react';
import { useBookStore } from '../../store/bookStore';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useBookStore();

  return (
    <div className="relative w-full max-w-md">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e7f6e]" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search titles, authors, subjects..."
        className="w-full bg-black/40 border border-[#e6d7c3]/15 rounded-full pl-10 pr-10 py-2 text-xs font-mono text-[#f5efe6] placeholder-[#8e7f6e] focus:outline-none focus:border-gold transition-colors"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8e7f6e] hover:text-[#f5efe6]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
