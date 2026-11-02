import { create } from 'zustand';

export interface VaultBook {
  id: string;
  title: string;
  author: string;
  category: 'Philosophy' | 'Classic' | 'Psychology' | 'History';
  year: string;
  pageCount: number;
  description: string;
  pdfUrl: string;
  coverImage: string;
  clothColor: string;
  foilColor: string;
  runeGlyph: string;
  accentHue: string;
}

export const PERSONAL_VAULT_BOOKS: VaultBook[] = [
  {
    id: 'vol-no-longer-human',
    title: 'No Longer Human',
    author: 'Osamu Dazai',
    category: 'Classic',
    year: '1948',
    pageCount: 176,
    description: 'A haunting, deeply introspective portrait of alienation, vulnerability, and mask-wearing in post-war Japan.',
    pdfUrl: '/books/NO LONGER HUMAN - OSAMU DAZAI.pdf',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780811204811-L.jpg',
    clothColor: '#181f33',
    foilColor: '#00f0ff',
    runeGlyph: '人間失格 // RELIC-01',
    accentHue: '#00f0ff',
  },
  {
    id: 'vol-the-fall-outsider',
    title: 'The Fall & The Outsider',
    author: 'Albert Camus',
    category: 'Philosophy',
    year: '1942 · 1956',
    pageCount: 224,
    description: 'Two seminal existential masterpieces by Albert Camus confronting moral isolation, absurdity, and unapologetic honesty.',
    pdfUrl: '/books/Camus, Albert - The Fall and The Outsider [tr. Gilbert] (Lythway, 1977).pdf',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780141182605-L.jpg',
    clothColor: '#3a2012',
    foilColor: '#ff9d00',
    runeGlyph: 'L\'ÉTRANGER // RELIC-02',
    accentHue: '#ff9d00',
  },
  {
    id: 'vol-dark-psychology',
    title: 'Dark Psychology',
    author: 'Behavioral Studies',
    category: 'Psychology',
    year: '2020',
    pageCount: 148,
    description: 'An analytical deconstruction of cognitive influence, covert persuasion mechanics, micro-expressions, and psychological defense.',
    pdfUrl: '/books/Dark Psychology - How to Analyze People, and Their Emotional Intelligence To Be Able to Avoid.pdf',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    clothColor: '#15171c',
    foilColor: '#bd00ff',
    runeGlyph: 'COGNITIO // RELIC-03',
    accentHue: '#bd00ff',
  },
  {
    id: 'vol-early-greek-philosophy',
    title: 'Early Greek Philosophy',
    author: 'John Burnet',
    category: 'Philosophy',
    year: '1892',
    pageCount: 412,
    description: 'The monumental scholarly study tracing the dawn of rational cosmology, logos, and natural philosophy from Thales to Democritus.',
    pdfUrl: '/books/EARLY GREEK PHILOSOPHY.pdf',
    coverImage: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    clothColor: '#14291c',
    foilColor: '#00ff66',
    runeGlyph: 'ΦΙΛΟΣΟΦΙΑ // RELIC-04',
    accentHue: '#00ff66',
  },
  {
    id: 'vol-the-untethered-soul',
    title: 'The Untethered Soul',
    author: 'Michael A. Singer',
    category: 'Philosophy',
    year: '2007',
    pageCount: 200,
    description: 'The transformative journey beyond personal ego, untethering consciousness from compulsive mental rumination and fear.',
    pdfUrl: '/books/The Untethered Soul (Michael A. Singer Michael Alan Singer).pdf',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781572245372-L.jpg',
    clothColor: '#12233b',
    foilColor: '#ffd700',
    runeGlyph: 'ANIMA // RELIC-05',
    accentHue: '#ffd700',
  },
  {
    id: 'vol-forbidden-knowledge',
    title: 'Forbidden Knowledge',
    author: 'Roger Shattuck',
    category: 'Classic',
    year: '1996',
    pageCount: 369,
    description: 'Investigating the philosophical and moral boundaries of human inquiry—from Prometheus and Faust to modern nuclear and genetic hubris.',
    pdfUrl: '/books/FORBIDDEN KNOWLEDGE - PROMETHEUS TO PORNOGRAPHY.pdf',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780156005517-L.jpg',
    clothColor: '#3d121c',
    foilColor: '#ff003c',
    runeGlyph: 'PROMETHEUS // RELIC-06',
    accentHue: '#ff003c',
  },
  {
    id: 'vol-central-banking',
    title: 'History of Central Banking',
    author: 'Stephen Mitford Goodson',
    category: 'History',
    year: '2014',
    pageCount: 224,
    description: 'A piercing historical chronicle of global currency issuance, fractional reserve systems, and national economic sovereignty.',
    pdfUrl: '/books/A HISTORY OF CENTRAL BANKING AND THE ENSLAVEMENT OF MANKIND.pdf',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781912759170-L.jpg',
    clothColor: '#2b2313',
    foilColor: '#e5b842',
    runeGlyph: 'MONETA // RELIC-07',
    accentHue: '#e5b842',
  },
];

interface VaultState {
  books: VaultBook[];
  selectedCategory: string;
  activeBookId: string | null;
  inspectedBook: VaultBook | null;
  cameraTarget: [number, number, number];
  isAudioMuted: boolean;
  isLoading: boolean;
  
  setSelectedCategory: (category: string) => void;
  setActiveBookId: (id: string | null) => void;
  setInspectedBook: (book: VaultBook | null) => void;
  setCameraTarget: (target: [number, number, number]) => void;
  toggleAudio: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  books: PERSONAL_VAULT_BOOKS,
  selectedCategory: 'All',
  activeBookId: null,
  inspectedBook: null,
  cameraTarget: [0, 0, 0],
  isAudioMuted: true,
  isLoading: true,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setActiveBookId: (id) => set({ activeBookId: id }),
  setInspectedBook: (book) => set({ inspectedBook: book }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
