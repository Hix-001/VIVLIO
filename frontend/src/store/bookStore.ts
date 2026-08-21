import { create } from 'zustand';
import { Book, Collection, ReadingProgress } from '../types';
import { BookAPI, ReadingAPI } from '../lib/api';

interface BookStore {
  books: Book[];
  activeBookId: string | null;
  shelfIndex: number;
  isLoading: boolean;
  searchQuery: string;
  readingProgress: Record<string, ReadingProgress>;

  fetchBooks: (search?: string) => Promise<void>;
  setActiveBookId: (id: string | null) => void;
  setShelfIndex: (index: number) => void;
  setSearchQuery: (query: string) => void;
  updateReadingProgress: (bookId: string, progress: Partial<ReadingProgress>) => Promise<void>;
  uploadNewBook: (formData: FormData) => Promise<Book>;
  deleteBook: (bookId: string) => Promise<void>;
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  activeBookId: null,
  shelfIndex: 0,
  isLoading: false,
  searchQuery: '',
  readingProgress: {},

  fetchBooks: async (search?: string) => {
    set({ isLoading: true });
    try {
      const books = await BookAPI.getBooks({ search });
      set({ books, isLoading: false });
      if (books.length > 0 && !get().activeBookId) {
        set({ activeBookId: books[0].id });
      }
    } catch (e) {
      console.error('Failed to fetch books from backend API:', e);
      set({ isLoading: false });
    }
  },

  setActiveBookId: (id: string | null) => {
    set({ activeBookId: id });
  },

  setShelfIndex: (index: number) => {
    const total = get().books.length;
    if (total === 0) return;
    const normalized = ((index % total) + total) % total;
    set({ shelfIndex: index });
    const active = get().books[normalized];
    if (active) {
      set({ activeBookId: active.id });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().fetchBooks(query);
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
    } catch (e) {
      console.warn('Could not sync reading progress with server:', e);
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
    await BookAPI.deleteBook(bookId);
    await get().fetchBooks();
  },
}));
