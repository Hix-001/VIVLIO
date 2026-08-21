import { create } from 'zustand';

export type ViewMode = 'shelf' | 'inspect' | 'reader' | 'collection';

interface UIStore {
  viewMode: ViewMode;
  isUploadModalOpen: boolean;
  isDetailsPanelOpen: boolean;
  isCoverOpen: boolean;
  currentSpread: number;
  
  setViewMode: (mode: ViewMode) => void;
  setUploadModalOpen: (open: boolean) => void;
  setDetailsPanelOpen: (open: boolean) => void;
  setCoverOpen: (open: boolean) => void;
  setCurrentSpread: (spread: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  viewMode: 'shelf',
  isUploadModalOpen: false,
  isDetailsPanelOpen: false,
  isCoverOpen: false,
  currentSpread: 0,

  setViewMode: (mode) => set({ viewMode: mode }),
  setUploadModalOpen: (open) => set({ isUploadModalOpen: open }),
  setDetailsPanelOpen: (open) => set({ isDetailsPanelOpen: open }),
  setCoverOpen: (open) => set({ isCoverOpen: open }),
  setCurrentSpread: (spread) => set({ currentSpread: spread }),
}));
