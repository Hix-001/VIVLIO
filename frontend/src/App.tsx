import React, { useState, useMemo } from 'react';
import { X, BookOpen, Download, Bookmark, Calendar, ArrowRight } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  coverImage?: string;
  pageCount: number;
  description: string;
  year: string;
}

const PAGE_STEP = 1.1;
const PAGE_INSET = 8;
const SKEW = '30deg';

const ALL_BOOKS: BookItem[] = [
  {
    id: '1',
    title: 'Shadows of\nthe Archive',
    author: 'Julian Morrow',
    category: 'Classic',
    cover: 'linear-gradient(150deg, #2a1a0e 0%, #3d2517 100%)',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    pageCount: 22,
    description: 'An enigmatic chronicle of forbidden texts and silent scholars in forgotten cloisters.',
    year: '1924',
  },
  {
    id: '2',
    title: 'The Temple\nof Lost Suns',
    author: 'Elena Rostova',
    category: 'Fantasy',
    cover: 'linear-gradient(150deg, #c46828 0%, #8a4520 100%)',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    pageCount: 18,
    description: 'A quest across scorched dunes to unearth the celestial mechanisms of a forgotten dynasty.',
    year: '1952',
  },
  {
    id: '3',
    title: 'Serpent\n& Thorn',
    author: 'Arthur Pendelton',
    category: 'Classic',
    cover: 'linear-gradient(150deg, #1a0a10 0%, #2e1018 100%)',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    pageCount: 26,
    description: 'A dark romantic meditation on venom, loyalty, and aristocratic ruin.',
    year: '1888',
  },
  {
    id: '4',
    title: 'The Last\nMessage',
    author: 'Clara Vance',
    category: 'Short Story',
    cover: 'linear-gradient(150deg, #161618 0%, #2a2a2e 100%)',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&q=80&w=600',
    pageCount: 14,
    description: 'Fragments recovered from deep space telemetric relays at the edge of the galaxy.',
    year: '2021',
  },
  {
    id: '5',
    title: 'All the Light\nWe Cannot See',
    author: 'Anthony Doerr',
    category: 'Memoir',
    cover: 'linear-gradient(150deg, #6a7a50 0%, #4a5a38 100%)',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
    pageCount: 20,
    description: 'Pulitzer Prize-winning tale of a blind French girl and a German radio operator during WWII.',
    year: '2014',
  },
  {
    id: '6',
    title: 'The Roommate\nRisk',
    author: 'Cassie Mae',
    category: 'Romance',
    cover: 'linear-gradient(150deg, #e8645a 0%, #c44a40 100%)',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600',
    pageCount: 28,
    description: 'When tight quarters spark unexpected chemistry, line-blurring affection takes over.',
    year: '2019',
  },
  {
    id: '7',
    title: 'Ashes of\nAeloria',
    author: 'Kaelen Drake',
    category: 'Fantasy',
    cover: 'linear-gradient(150deg, #1a1a22 0%, #2a2a30 100%)',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
    pageCount: 16,
    description: 'The twilight of dragons and iron kings across the ruined northern continents.',
    year: '1987',
  },
  {
    id: '8',
    title: 'Own Your\nTime',
    author: 'Marcus Vane',
    category: 'Memoir',
    cover: 'linear-gradient(150deg, #e85a10 0%, #c84a08 100%)',
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600',
    pageCount: 24,
    description: 'Principles of relentless focus and radical sovereign freedom in the digital age.',
    year: '2023',
  },
  {
    id: '9',
    title: 'The Quiet\nWitness',
    author: 'Soren Lind',
    category: 'Short Story',
    cover: 'linear-gradient(150deg, #1a1e24 0%, #2a3038 100%)',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
    pageCount: 30,
    description: 'An introspective courtroom mystery set in cold Scandinavian fiords.',
    year: '2011',
  },
  {
    id: '10',
    title: 'The Light\nWe Carry',
    author: 'Michelle Obama',
    category: 'Memoir',
    cover: 'linear-gradient(150deg, #0e1a30 0%, #1a2a48 100%)',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    pageCount: 19,
    description: 'Overcoming uncertain times with grace, community, and personal flame.',
    year: '2022',
  },
  {
    id: '11',
    title: 'The Bright\nBeyond',
    author: 'David Chalmers',
    category: 'Philosophy',
    cover: 'linear-gradient(150deg, #0c1428 0%, #1a2040 100%)',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600',
    pageCount: 22,
    description: 'A metaphysical inquiry into artificial consciousness and virtual realms.',
    year: '2020',
  },
  {
    id: '12',
    title: 'The Spaces\nBetween',
    author: 'Aria Thorne',
    category: 'Romance',
    cover: 'linear-gradient(150deg, #c8b8a0 0%, #a89878 100%)',
    coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=600',
    pageCount: 15,
    description: 'A poetic story of distance, longing, and unsent handwritten letters across the Atlantic.',
    year: '2016',
  },
  {
    id: '13',
    title: 'Sunshine and\nSecond Chances',
    author: 'Brooke Miller',
    category: 'Romance',
    cover: 'linear-gradient(150deg, #f5e6b8 0%, #e8c870 100%)',
    coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600',
    pageCount: 20,
    description: 'A lighthearted summer return to coastal hometowns and rekindled warmth.',
    year: '2018',
  },
  {
    id: '14',
    title: 'The Stories\nWe Keep',
    author: 'Nathaniel Reed',
    category: 'Classic',
    cover: 'linear-gradient(150deg, #b8a0d0 0%, #9480b8 100%)',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600',
    pageCount: 18,
    description: 'A bibliophile unearths memoirs that predict the future of his own family.',
    year: '1974',
  },
  {
    id: '15',
    title: 'The Right Swing\nWrong Timing',
    author: 'Leo Harris',
    category: 'Short Story',
    cover: 'linear-gradient(150deg, #f0b8c8 0%, #e8a0b0 100%)',
    coverImage: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=600',
    pageCount: 16,
    description: 'The golden jazz era in Harlem through the eyes of a saxophonist.',
    year: '1961',
  },
  {
    id: '16',
    title: 'The Ivory\nTower',
    author: 'Archival Collection',
    category: 'Classic',
    cover: 'linear-gradient(150deg, #2a3040 0%, #1a2030 100%)',
    coverImage: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260528_045156_4a79ba3c-ba56-4cd4-834b-d9728f56d1a4.png&w=1920&q=85',
    pageCount: 20,
    description: 'A critical study of intellectual isolation and academy politics.',
    year: '1930',
  },
  {
    id: '17',
    title: 'Gilded\nDust',
    author: 'Archival Collection',
    category: 'Classic',
    cover: 'linear-gradient(150deg, #3a2a18 0%, #2a1a10 100%)',
    coverImage: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260528_044451_68c948df-6c4c-45eb-974e-923486a41e41.png&w=1920&q=85',
    pageCount: 24,
    description: 'The forgotten history of the California and Victorian gold prospectors.',
    year: '1908',
  },
  {
    id: '18',
    title: 'Nocturne\nin Blue',
    author: 'Archival Collection',
    category: 'Memoir',
    cover: 'linear-gradient(150deg, #1a2838 0%, #0e1828 100%)',
    coverImage: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260528_043853_b2f3c7c8-5d47-43bc-9ce4-2fa8d717e42b.png&w=1920&q=85',
    pageCount: 18,
    description: 'Reflections composed by the sea during solitary Mediterranean winters.',
    year: '1955',
  },
  {
    id: '19',
    title: 'Ember\nSpire',
    author: 'Archival Collection',
    category: 'Fantasy',
    cover: 'linear-gradient(150deg, #28201a 0%, #1a1410 100%)',
    coverImage: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260528_043838_240c7443-18d6-4d61-be4a-2d01e2dd65a6.png&w=1920&q=85',
    pageCount: 26,
    description: 'The rise and fall of the obsidian towers overlooking the volcanic caldera.',
    year: '1984',
  },
  {
    id: '20',
    title: 'The Iron\nCrest',
    author: 'Archival Collection',
    category: 'Fantasy',
    cover: 'linear-gradient(150deg, #2a3828 0%, #1a2818 100%)',
    coverImage: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260528_043832_62031210-1de3-47a6-ac3f-78eb84e99858.png&w=1920&q=85',
    pageCount: 22,
    description: 'Chronicles of chivalric vows broken under the northern aurora.',
    year: '1979',
  },
  {
    id: '21',
    title: 'Solitude\n& Stone',
    author: 'Archival Collection',
    category: 'Philosophy',
    cover: 'linear-gradient(150deg, #382a20 0%, #281a12 100%)',
    coverImage: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260528_043220_eb34b2f8-8a78-4b29-bbbc-d61e137aedad.png&w=1920&q=85',
    pageCount: 14,
    description: 'A hermit monk’s meditations on silence, granite, and eternity.',
    year: '1899',
  },
  {
    id: '22',
    title: 'Echoes\nof Glass',
    author: 'Archival Collection',
    category: 'Short Story',
    cover: 'linear-gradient(150deg, #1a2028 0%, #101820 100%)',
    coverImage: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260528_043212_ce1559e3-e0a6-48c8-887f-1331a8e989c5.png&w=1920&q=85',
    pageCount: 28,
    description: 'Surrealist stories about mirror artisans in Renaissance Venice.',
    year: '1968',
  },
  {
    id: '23',
    title: 'Ancient\nRites',
    author: 'Archival Collection',
    category: 'Classic',
    cover: 'linear-gradient(150deg, #302818 0%, #201810 100%)',
    coverImage: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260528_032638_9520b937-d7e8-4f6a-88ba-8bbd1e8ecbfe.png&w=1920&q=85',
    pageCount: 16,
    description: 'Anthropological excavation of Neolithic standing stones and solar worship.',
    year: '1912',
  },
  {
    id: '24',
    title: 'Vesper\nBreeze',
    author: 'Archival Collection',
    category: 'Romance',
    cover: 'linear-gradient(150deg, #20282e 0%, #141c22 100%)',
    coverImage: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260528_043201_f749ce8e-72f6-46eb-8440-0f6bdbf2a782.png&w=1920&q=85',
    pageCount: 19,
    description: 'A romance set against the olive orchards of late nineteenth-century Florence.',
    year: '1895',
  },
];

// Realistic Isometric 2.5D Book Component
const BookCard: React.FC<{ book: BookItem; onClick: () => void }> = ({ book, onClick }) => {
  const depth = PAGE_STEP * (book.pageCount + 1);

  return (
    <div
      className="book"
      style={{ width: `${200 + depth + 1.1}px` }}
      onClick={onClick}
    >
      {/* Book Hinge */}
      <div
        className="book-hinge"
        style={{
          width: `${depth + 1}px`,
          background: book.cover,
        }}
      />

      {/* Back Cover Board */}
      <div
        className="book-layer book-back-cover"
        style={{
          background: book.cover,
          transform: `translateX(${depth}px) skewY(${SKEW})`,
        }}
      />

      {/* Gilded Stacked Paper Pages */}
      {Array.from({ length: book.pageCount }).map((_, idx) => {
        const i = idx + 1;
        const t = i / book.pageCount;
        return (
          <div
            key={i}
            className="book-layer book-page"
            style={{
              transform: `translateX(${PAGE_STEP * i}px) skewY(${SKEW})`,
              zIndex: 2 + (book.pageCount - i),
              filter: `brightness(${(1 - t * 0.06).toFixed(3)})`,
              top: `${PAGE_INSET / 2}px`,
              height: `calc(100% - ${PAGE_INSET}px)`,
            }}
          />
        );
      })}

      {/* Front Cover Board */}
      <div
        className="book-layer book-front-cover"
        style={{
          transform: `skewY(${SKEW})`,
          backgroundImage: book.coverImage ? `url(${book.coverImage})` : undefined,
          background: !book.coverImage ? book.cover : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);

  const categories = ['All', 'Romance', 'Short Story', 'Memoir', 'Classic', 'Fantasy', 'Philosophy'];

  const filteredBooks = useMemo(() => {
    if (selectedCategory === 'All') return ALL_BOOKS;
    return ALL_BOOKS.filter((b) => b.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory]);

  // Double the list for seamless marquee infinite scrolling
  const marqueeBooks = useMemo(() => {
    const list = filteredBooks.length > 0 ? filteredBooks : ALL_BOOKS;
    return [...list, ...list];
  }, [filteredBooks]);

  const handleDownload = (book: BookItem) => {
    // Generate a simple simulated download
    const element = document.createElement('a');
    const file = new Blob([`Archival Edition: ${book.title}\nAuthor: ${book.author}\nYear: ${book.year}\nCategory: ${book.category}\n\n${book.description}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${book.title.replace('\n', ' ')} - ${book.author}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section className="hero">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => setSelectedCategory('All')}>
          <div className="nav-mark" />
          <div className="nav-brand-text">Vivlio</div>
        </div>

        <div className="nav-links">
          <button onClick={() => setSelectedCategory('All')}>Catalogs</button>
          <button onClick={() => setSelectedCategory('Classic')}>Editions</button>
          <button onClick={() => setSelectedCategory('Philosophy')}>Hub</button>
          <button onClick={() => setSelectedCategory('Memoir')}>Info</button>
        </div>

        <div className="nav-right">
          <button onClick={() => setSelectedCategory('Fantasy')}>Join us</button>
          <button className="nav-cta" onClick={() => setActiveBook(ALL_BOOKS[0])}>
            Build Your List
          </button>
        </div>

        <button className="nav-mobile-toggle" aria-label="Toggle menu" onClick={() => setActiveBook(ALL_BOOKS[0])}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </nav>

      {/* Hero Massive Title */}
      <h1 className="hero-title">Vivlio</h1>

      {/* Category Filter Pills */}
      <div className="hero-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`hero-category-pill ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Infinite 2.5D Tilt Marquee */}
      <div className="marquee-mask" style={{ '--marquee-tilt': '-7deg' } as React.CSSProperties}>
        <div className="marquee-fade">
          <div className="marquee-track">
            {marqueeBooks.map((book, idx) => (
              <div
                key={`${book.id}-${idx}`}
                className="book-wrap"
                style={{ zIndex: marqueeBooks.length - idx }}
              >
                <BookCard book={book} onClick={() => setActiveBook(book)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Inspection Modal Drawer */}
      {activeBook && (
        <div
          className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setActiveBook(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#141210] border border-[#f5f1ea]/15 rounded-2xl p-8 text-[#f5f1ea] shadow-2xl flex flex-col md:flex-row gap-6 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveBook(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#c4b5a2] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Book Cover Miniature */}
            <div className="w-40 aspect-[3/4] rounded-lg overflow-hidden shadow-2xl border border-white/20 flex-shrink-0 bg-black/50">
              <img
                src={activeBook.coverImage}
                alt={activeBook.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Book Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#d4af37] block mb-1">
                  {activeBook.category} &middot; {activeBook.year}
                </span>

                <h3 className="font-serif text-2xl text-[#f5f1ea] leading-tight whitespace-pre-line mb-1">
                  {activeBook.title}
                </h3>

                <p className="font-serif italic text-sm text-[#c4b5a2] mb-4">
                  {activeBook.author}
                </p>

                <p className="text-xs text-[#a89885] leading-relaxed mb-6 font-sans">
                  {activeBook.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(activeBook)}
                  className="px-4 py-2.5 rounded-full bg-[#f5f1ea] text-[#0a0a0a] font-medium text-xs flex items-center gap-2 hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-lg"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => setActiveBook(null)}
                  className="px-4 py-2.5 rounded-full bg-white/5 border border-white/15 text-[#f5f1ea] text-xs flex items-center gap-2 hover:bg-white/10 transition-all"
                >
                  <span>Explore More</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default App;
