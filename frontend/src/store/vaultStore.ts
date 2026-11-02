import { create } from 'zustand';
import { sounds } from '../lib/sound';

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

export const PEDESTAL_RADIUS = 3.6;
export const BOOK_COUNT = 7;

export function getPedestalTransform(i: number, count: number = BOOK_COUNT, radius: number = PEDESTAL_RADIUS) {
  const angle = ((i - (count - 1) / 2) / count) * (Math.PI * 1.25) + Math.PI / 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const rotY = -angle + Math.PI / 2;
  return { x, z, rotY, angle };
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
  readingBook: VaultBook | null;
  isReaderOpen: boolean;
  readerViewMode: 'spread' | 'single';
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  focusedPedestalIndex: number | null;
  isHeroMode: boolean;
  featuredHeroBookId: string;
  clickWaypoint: [number, number, number] | null;
  isAudioMuted: boolean;
  isLoading: boolean;
  
  setSelectedCategory: (category: string) => void;
  setActiveBookId: (id: string | null) => void;
  setInspectedBook: (book: VaultBook | null) => void;
  openReader: (book: VaultBook) => void;
  closeReader: () => void;
  setReaderViewMode: (mode: 'spread' | 'single') => void;
  setHeroMode: (hero: boolean) => void;
  setFeaturedHeroBookId: (id: string) => void;
  setCameraTarget: (target: [number, number, number]) => void;
  setCameraPosition: (pos: [number, number, number]) => void;
  walkToFloorPoint: (point: [number, number, number]) => void;
  focusPedestal: (index: number) => void;
  resetView: () => void;
  walkCamera: (forward: number, strafe: number) => void;
  toggleAudio: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  books: PERSONAL_VAULT_BOOKS,
  selectedCategory: 'All',
  activeBookId: null,
  inspectedBook: null,
  readingBook: null,
  isReaderOpen: false,
  readerViewMode: 'spread',
  cameraTarget: [0, 0.75, 0],
  cameraPosition: [0, 1.45, 3.8], // Intimate Hero reveal viewpoint
  focusedPedestalIndex: null,
  isHeroMode: true, // Start in 3D Book Reveal Hero Section
  featuredHeroBookId: PERSONAL_VAULT_BOOKS[0].id,
  clickWaypoint: null,
  isAudioMuted: false, // unmuted by default for tactile clicks & ambient sanctuary
  isLoading: true,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setActiveBookId: (id) => set({ activeBookId: id }),
  setInspectedBook: (book) => set({ inspectedBook: book }),
  openReader: (book) => {
    sounds.playPaperTurn();
    set({ readingBook: book, isReaderOpen: true, inspectedBook: null });
  },
  closeReader: () => set({ isReaderOpen: false, readingBook: null }),
  setReaderViewMode: (mode) => set({ readerViewMode: mode }),
  
  setHeroMode: (hero: boolean) => {
    sounds.playTactileClick();
    if (hero) {
      set({
        isHeroMode: true,
        focusedPedestalIndex: null,
        cameraTarget: [0, 0.75, 0],
        cameraPosition: [0, 1.45, 3.8],
      });
    } else {
      set({
        isHeroMode: false,
        cameraTarget: [0, 0.3, 0],
        cameraPosition: [0, 1.8, 6.2],
      });
    }
  },

  setFeaturedHeroBookId: (id: string) => {
    sounds.playSanctuaryChime();
    set({ featuredHeroBookId: id, activeBookId: id });
  },

  setCameraTarget: (target) => set({ cameraTarget: target }),
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  
  walkToFloorPoint: (point: [number, number, number]) => {
    const { cameraPosition } = get();
    sounds.playTactileClick();
    // Maintain eye height at 1.6m and look ahead towards the clicked point
    const destX = Math.max(-10, Math.min(10, point[0]));
    const destZ = Math.max(-10, Math.min(10, point[2]));
    
    // Look ahead in direction of movement
    const dirX = destX - cameraPosition[0];
    const dirZ = destZ - cameraPosition[2];
    const len = Math.sqrt(dirX * dirX + dirZ * dirZ) || 1;
    const lookX = destX + (dirX / len) * 2;
    const lookZ = destZ + (dirZ / len) * 2;

    set({
      isHeroMode: false,
      clickWaypoint: [destX, -1.2, destZ],
      cameraPosition: [destX, 1.6, destZ],
      cameraTarget: [lookX, 0.6, lookZ],
    });

    // Clear waypoint beacon ripple after animation
    setTimeout(() => {
      set({ clickWaypoint: null });
    }, 2400);
  },

  focusPedestal: (index: number) => {
    const { books } = get();
    if (index < 0 || index >= books.length) return;
    const book = books[index];
    const { x, z, rotY } = getPedestalTransform(index, books.length, PEDESTAL_RADIUS);
    
    // Position camera ~1.5m in front of the book looking straight at the lectern
    const camX = x + Math.sin(rotY) * 1.5;
    const camZ = z + Math.cos(rotY) * 1.5;
    const camY = 1.35; // Eye height at lectern

    sounds.playSanctuaryChime();

    set({
      isHeroMode: false,
      focusedPedestalIndex: index,
      activeBookId: book.id,
      cameraTarget: [x, 0.45, z],
      cameraPosition: [camX, camY, camZ],
    });
  },

  resetView: () => {
    sounds.playTactileClick();
    set({
      isHeroMode: false,
      focusedPedestalIndex: null,
      activeBookId: null,
      cameraTarget: [0, 0.3, 0],
      cameraPosition: [0, 1.8, 6.2],
    });
  },

  walkCamera: (forward: number, strafe: number) => {
    const { cameraPosition, cameraTarget, isHeroMode } = get();
    // Automatically exit hero mode when walking starts
    if (isHeroMode) {
      set({ isHeroMode: false });
    }

    // Compute forward vector in XZ plane
    const dx = cameraTarget[0] - cameraPosition[0];
    const dz = cameraTarget[2] - cameraPosition[2];
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    const fX = dx / len;
    const fZ = dz / len;
    
    // Perpendicular strafe vector
    const sX = -fZ;
    const sZ = fX;

    const moveX = fX * forward + sX * strafe;
    const moveZ = fZ * forward + sZ * strafe;

    // Boundary circular collision with library perimeter
    const nextX = Math.max(-9.5, Math.min(9.5, cameraPosition[0] + moveX));
    const nextZ = Math.max(-9.5, Math.min(9.5, cameraPosition[2] + moveZ));

    set({
      focusedPedestalIndex: null,
      cameraPosition: [nextX, cameraPosition[1], nextZ],
      cameraTarget: [
        cameraTarget[0] + (nextX - cameraPosition[0]),
        cameraTarget[1],
        cameraTarget[2] + (nextZ - cameraPosition[2]),
      ],
    });
  },

  toggleAudio: () => set((state) => {
    const nextMuted = !state.isAudioMuted;
    sounds.setMuted(nextMuted);
    return { isAudioMuted: nextMuted };
  }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));


