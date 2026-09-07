import { create } from 'zustand';
import { Book, ReadingProgress } from '../types';
import { BookAPI, ReadingAPI } from '../lib/api';
import { CURATED_101_BOOKS } from '../data/curated101Books';

export const DEFAULT_BOOKS: Book[] = CURATED_101_BOOKS;

interface BookStore {
  books: Book[];
  activeBookId: string | null;
  shelfIndex: number;
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  readingProgress: Record<string, ReadingProgress>;

  fetchBooks: (search?: string) => Promise<void>;
  setActiveBookId: (id: string | null) => void;
  setShelfIndex: (index: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  updateReadingProgress: (bookId: string, progress: Partial<ReadingProgress>) => Promise<void>;
  uploadNewBook: (formData: FormData) => Promise<Book>;
  deleteBook: (bookId: string) => Promise<void>;
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: DEFAULT_BOOKS,
  activeBookId: DEFAULT_BOOKS[0]?.id || 'vol-meditations',
  shelfIndex: 0,
  isLoading: false,
  searchQuery: '',
  selectedCategory: 'All',
  readingProgress: {},

  fetchBooks: async (search?: string) => {
    set({ isLoading: true });
    try {
      const serverBooks = await BookAPI.getBooks({ search });
      if (Array.isArray(serverBooks) && serverBooks.length > 0) {
        set({ books: serverBooks, isLoading: false });
        if (!get().activeBookId) {
          set({ activeBookId: serverBooks[0].id });
        }
      } else {
        set({ books: DEFAULT_BOOKS, isLoading: false });
      }
    } catch {
      // Backend unavailable on static deployment (e.g. Vercel)
      set({ books: DEFAULT_BOOKS, isLoading: false });
    }
  },

  setActiveBookId: (id: string | null) => {
    set({ activeBookId: id });
  },

  setShelfIndex: (index: number) => {
    const list = Array.isArray(get().books) && get().books.length > 0 ? get().books : DEFAULT_BOOKS;
    const total = list.length;
    const normalized = ((index % total) + total) % total;
    set({ shelfIndex: index });
    const active = list[normalized];
    if (active) {
      set({ activeBookId: active.id });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    const cat = get().selectedCategory;
    let filtered = DEFAULT_BOOKS;
    if (cat && cat !== 'All') {
      filtered = filtered.filter((b) => b.category === cat);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.category && b.category.toLowerCase().includes(q))
      );
    }
    set({ books: filtered });
  },

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
    const query = get().searchQuery;
    let filtered = DEFAULT_BOOKS;
    if (category && category !== 'All') {
      filtered = filtered.filter((b) => b.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.category && b.category.toLowerCase().includes(q))
      );
    }
    set({ books: filtered });
  },

  updateReadingProgress: async (bookId: string, progress: Partial<ReadingProgress>) => {
    try {
      const updated = await ReadingAPI.updateProgress(bookId, progress);
      set((state) => ({
        readingProgress: {
          ...state.readingProgress,
          [bookId]: updated,
        },
      }));
    } catch {
      // Offline fallback
    }
  },

  uploadNewBook: async (formData: FormData): Promise<Book> => {
    set({ isLoading: true });
    try {
      const newBook = await BookAPI.uploadBook(formData);
      await get().fetchBooks();
      set({ activeBookId: newBook.id, isLoading: false });
      return newBook;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  deleteBook: async (bookId: string) => {
    try {
      await BookAPI.deleteBook(bookId);
      await get().fetchBooks();
    } catch {
      // Local filter fallback
      set((state) => ({
        books: state.books.filter((b) => b.id !== bookId),
      }));
    }
  },
}));
