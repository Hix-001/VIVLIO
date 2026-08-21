# Vivlio — Personal 3D Library Platform 📖✨

A production-ready, full-stack personal 3D library and reader platform built with **React + TypeScript + Three.js** on the frontend and **FastAPI + SQLAlchemy** on the backend.

Browse your personal PDF book collection on a continuous 3D clothbound hardcover shelf, inspect volumes with realistic cover physics, and read complete two-page spreads with high-resolution PDF rendering accompanied by a native FLAC music audio player.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          Frontend                           │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐  │
│  │ React 18 + Vite │  │ Three.js + R3F   │  │ PDF.js     │  │
│  │ TypeScript      │  │ Zustand Store    │  │ Tailwind   │  │
│  │ FLAC Audio Eng. │  │ Signal Auth UI   │  │ Lucide UI  │  │
│  └─────────────────┘  └──────────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                          API Layer                          │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐  │
│  │ FastAPI         │  │ PyPDF2 Extractor │  │ JWT / Auth │  │
│  │ Python 3.11     │  │ Static Audio/PDF │  │ REST API   │  │
│  └─────────────────┘  └──────────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database & Storage                      │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐  │
│  │ SQLite (Local)  │  │ PostgreSQL       │  │ PDF Store  │  │
│  │ Zero-config dev │  │ (Neon / Supabase)│  │ FLAC Store │  │
│  └─────────────────┘  └──────────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- **Continuous 3D Carousel Shelf**: Infinite smooth modulo rotation across a quarter-sawn walnut shelf plinth with dynamic depth offsets.
- **Clothbound Hardcovers with Gold/Silver Foil Blocking**: Procedural canvas textures for woven cloth, spine typography, and embossed foil motifs.
- **Full-Screen 3D PDF Reader View**: Two-page book spreads rendered from your local PDF documents with page navigation, zoom controls, and keyboard shortcuts.
- **🏛️ Medieval 3D Scriptorium & Walking Avatar Mode**: Interactive third-person monastic avatar with WASD walk controls, spacebar jumps, real-time lantern illumination, and book raycasting.
- **🎵 Native FLAC Music Player**: Built-in audio player for high-fidelity `.flac` tracks with spinning vinyl HUD, volume mixing, and responsive playlist menu.
- **🔒 Signal-Themed Auth Portal**: Pixel-locked, calibrated authentication interface protecting your personal library.
- **Drag & Drop Book Uploader**: Upload any PDF file (`.pdf`) to bind into a 3D cloth hardcover on the shelf with automatic metadata extraction.
- **Automatic Reading History & Bookmarking**: Saves last-read page and progress automatically per book to resume right where you left off.
- **Auto-Seeding**: Automatically detects and loads all PDF books in the `book/` folder into your collection on first run.

---

## 🚀 Quickstart

### Option 1: Run with Docker Compose
```bash
docker-compose up --build
```
- Frontend: **`http://localhost:3000`**
- Backend API Docs: **`http://localhost:8000/docs`**

---

### Option 2: Run Locally (Development Mode)

#### 1. Start Backend (FastAPI)
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

#### 2. Start Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Open **`http://localhost:5173`** in your browser.

---

## 🔐 Master User Credentials
- **Username**: `harsh`
- **Password**: `0219`

---

## 📁 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── api/endpoints/      # Books, Reading history, Collections, Auth
│   │   ├── core/               # Settings, Database, Security
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic data validation
│   │   ├── services/           # PDF metadata extraction & seeder
│   │   └── main.py             # FastAPI entrypoint & static mounts
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── public/                 # Static assets, auth.html, library.html
│   ├── src/
│   │   ├── components/3d/      # Three.js / R3F Scene, Book3D, Shelf, Lighting
│   │   ├── components/audio/   # AudioControls & FLAC playlist HUD
│   │   ├── components/ui/      # Header, ShelfControls, BookDetails, UploadModal, Reader
│   │   ├── components/collections/ # Grid, SearchBar, BookCard
│   │   ├── lib/                # API client, PDF.js renderer, AudioManager
│   │   ├── store/              # Zustand state stores (audio, books, reading)
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Root application & Auth guards
│   │   └── index.css           # Design tokens & Tailwind CSS
│   ├── package.json
│   └── vite.config.ts
│
├── book/                       # PDF Library Collection
├── music/                      # FLAC Audio Tracks
├── auth_index.html             # Standalone Pixel-Locked Signal Auth Portal
├── medieval_library.html       # Standalone 3D Medieval Walking Avatar Scriptorium
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## ⌨️ Keyboard Controls

### 3D Shelf & Reader
- `← / →`: Browse shelf or turn reader spreads
- `Space / Enter`: Inspect selected book
- `Escape`: Return to shelf overview

### Medieval Avatar Mode
- `W / A / S / D`: Walk in 3D space
- `Space`: Jump
- `Click`: Inspect book volume
