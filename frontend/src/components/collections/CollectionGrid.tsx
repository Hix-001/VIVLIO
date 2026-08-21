import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { BookCard } from './BookCard';
import { useBookStore } from '../../store/bookStore';
import { useUIStore } from '../../store/uiStore';

export const CollectionGrid: React.FC = () => {
  const { books, isLoading } = useBookStore();
  const { viewMode, setViewMode } = useUIStore();

  if (viewMode !== 'collection') return null;

  return (
    <div className="fixed inset-0 z-30 bg-[#100f0d]/95 backdrop-blur-2xl flex flex-col p-8 overflow-y-auto">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e6d7c3]/15">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode('shelf')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-[#e6d7c3]/15 text-[#f5efe6] px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all"
          >
            <ArrowLeft size={14} />
            <span>Return to 3D Shelf</span>
          </button>

          <div>
            <h2 className="font-serifDisplay text-3xl text-[#f5efe6]">The Complete Library</h2>
            <span className="font-mono text-xs text-[#8e7f6e] uppercase tracking-wider">
              {books.length} Clothbound Volumes Cataloged
            </span>
          </div>
        </div>

        <SearchBar />
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
