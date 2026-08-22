import { create } from 'zustand';
import { Book, ReadingProgress } from '../types';
import { BookAPI, ReadingAPI } from '../lib/api';

export const DEFAULT_BOOKS: Book[] = [
  {
    id: 'vol-no-longer-human',
    title: 'No Longer Human',
    author: 'Osamu Dazai',
    description: 'A portrait of alienation and solitude in modern Japan.',
    file_path: '/book/NO LONGER HUMAN - OSAMU DAZAI.pdf',
    pdf_url: '/book/NO LONGER HUMAN - OSAMU DAZAI.pdf',
    total_pages: 176,
    cloth_color: '#181f33',
    foil_color: '#a8c5db',
    theme_glow: 'rgba(168, 197, 219, 0.25)',
    dimensions: { width: 1.5, height: 2.2, depth: 0.4 }
  },
  {
    id: 'vol-the-fall',
    title: 'The Fall & The Outsider',
    author: 'Albert Camus',
    description: 'Absurdity, freedom and moral isolation in two masterpieces.',
    file_path: '/book/Camus, Albert - The Fall and The Outsider [tr. Gilbert] (Lythway, 1977).pdf',
    pdf_url: '/book/Camus, Albert - The Fall and The Outsider [tr. Gilbert] (Lythway, 1977).pdf',
    total_pages: 224,
    cloth_color: '#683b1d',
    foil_color: '#df9652',
    theme_glow: 'rgba(223, 150, 82, 0.25)',
    dimensions: { width: 1.5, height: 2.2, depth: 0.45 }
  },
  {
    id: 'vol-early-greek',
    title: 'Early Greek Philosophy',
    author: 'John Burnet',
    description: 'The origins of cosmology and rational enquiry in the pre-Socratic era.',
    file_path: '/book/EARLY GREEK PHILOSOPHY.pdf',
    pdf_url: '/book/EARLY GREEK PHILOSOPHY.pdf',
    total_pages: 412,
    cloth_color: '#1e3826',
    foil_color: '#e5c468',
    theme_glow: 'rgba(229, 196, 104, 0.25)',
    dimensions: { width: 1.5, height: 2.2, depth: 0.55 }
  },
  {
    id: 'vol-dark-psychology',
    title: 'Dark Psychology',
    author: 'Behavioral Studies',
    description: 'Perception, emotional dynamics and influence tactics to be aware of.',
    file_path: '/book/Dark Psychology - How to Analyze People, and Their Emotional Intelligence To Be Able to Avoid.pdf',
    pdf_url: '/book/Dark Psychology - How to Analyze People, and Their Emotional Intelligence To Be Able to Avoid.pdf',
    total_pages: 148,
    cloth_color: '#1e2024',
    foil_color: '#dc8448',
    theme_glow: 'rgba(220, 132, 72, 0.25)',
    dimensions: { width: 1.5, height: 2.2, depth: 0.38 }
  },
  {
    id: 'vol-untethered-soul',
    title: 'The Untethered Soul',
    author: 'Michael A. Singer',
    description: 'The journey beyond yourself and exploring inner consciousness.',
    file_path: '/book/The Untethered Soul (Michael A. Singer Michael Alan Singer).pdf',
    pdf_url: '/book/The Untethered Soul (Michael A. Singer Michael Alan Singer).pdf',
    total_pages: 200,
    cloth_color: '#162842',
    foil_color: '#f5d36e',
    theme_glow: 'rgba(245, 211, 110, 0.25)',
    dimensions: { width: 1.5, height: 2.2, depth: 0.42 }
  }
];

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
  books: DEFAULT_BOOKS,
  activeBookId: DEFAULT_BOOKS[0]?.id || 'vol-no-longer-human',
  shelfIndex: 0,
  isLoading: false,
  searchQuery: '',
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
    if (!query) {
      set({ books: DEFAULT_BOOKS });
      return;
    }
    const filtered = DEFAULT_BOOKS.filter(
      (b) =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase())
    );
    set({ books: filtered.length > 0 ? filtered : DEFAULT_BOOKS });
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
