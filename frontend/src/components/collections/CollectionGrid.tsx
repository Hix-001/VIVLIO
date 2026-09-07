import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { BookCard } from './BookCard';
import { useBookStore } from '../../store/bookStore';
import { useUIStore } from '../../store/uiStore';

export const CollectionGrid: React.FC = () => {
  const { books, isLoading, selectedCategory, setSelectedCategory } = useBookStore();
  const { viewMode, setViewMode } = useUIStore();

  const categories = ['All', 'Philosophy', 'Classics', 'Psychology', 'Gothic & Dark', 'Mind & Strategy'];

  if (viewMode !== 'collection') return null;

  return (
    <div className="fixed inset-0 z-30 bg-[#100f0d]/95 backdrop-blur-2xl flex flex-col p-8 overflow-y-auto">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-6 mb-8 pb-6 border-b border-[#e6d7c3]/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('shelf')}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-[#e6d7c3]/15 text-[#f5efe6] px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all"
            >
              <ArrowLeft size={14} />
              <span>Return to 3D Shelf</span>
            </button>

            <div>
              <h2 className="font-serifDisplay text-3xl text-[#f5efe6]">The 101 Masterpiece Archive</h2>
              <span className="font-mono text-xs text-[#8e7f6e] uppercase tracking-wider">
                {books.length} Curated Volumes Cataloged
              </span>
            </div>
          </div>

          <SearchBar />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gold text-[#100f0d] font-bold shadow-md shadow-gold/20'
                  : 'bg-white/5 hover:bg-white/10 text-[#c4b5a2] border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Volumes */}
      <div className="max-w-7xl w-full mx-auto">
        {isLoading ? (
          <div className="text-center py-20 font-mono text-sm text-gold">Loading collection...</div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 font-serifBody italic text-xl text-[#8e7f6e]">
            No books found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
