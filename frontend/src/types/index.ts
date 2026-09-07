export interface BookDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Book {
  id: string;
  user_id?: string;
  title: string;
  author: string;
  subtitle?: string;
  description?: string;
  year?: string;
  category?: string;
  pdf_url: string;
  file_path?: string;
  cover_url?: string;
  pages?: number;
  total_pages?: number;
  cloth_color: string;
  cloth_roughness?: string;
  cloth_metalness?: string;
  foil_color: string;
  foil_metalness?: string;
  foil_roughness?: string;
  theme_glow?: string;
  theme_hue?: string;
  dimensions?: BookDimensions;
  created_at?: string;
  updated_at?: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  theme?: {
    color: string;
    foil: string;
  };
  sort_order?: number;
  created_at?: string;
  books?: Book[];
}

export interface ReadingProgress {
  id?: string;
  book_id: string;
  last_page: number;
  last_spread: number;
  total_pages: number;
  reading_time_minutes?: number;
  completed?: boolean;
  last_read_at?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
}
