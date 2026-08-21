import axios from 'axios';
import { Book, Collection, ReadingProgress, User } from '../types';

const API_BASE = '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const BookAPI = {
  getBooks: async (params?: { search?: string; collection_id?: string }): Promise<Book[]> => {
    const res = await api.get<Book[]>('/books', { params });
    return res.data;
  },

  getBook: async (bookId: string): Promise<Book> => {
    const res = await api.get<Book>(`/books/${bookId}`);
    return res.data;
  },

  uploadBook: async (formData: FormData): Promise<Book> => {
    const res = await api.post<Book>('/books/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteBook: async (bookId: string): Promise<void> => {
    await api.delete(`/books/${bookId}`);
  },
};

export const ReadingAPI = {
  getProgress: async (bookId: string): Promise<ReadingProgress> => {
    const res = await api.get<ReadingProgress>(`/reading/${bookId}`);
    return res.data;
  },

  updateProgress: async (bookId: string, progress: Partial<ReadingProgress>): Promise<ReadingProgress> => {
    const res = await api.post<ReadingProgress>(`/reading/${bookId}`, progress);
    return res.data;
  },
};

export const CollectionAPI = {
  getCollections: async (): Promise<Collection[]> => {
    const res = await api.get<Collection[]>('/collections');
    return res.data;
  },
};
