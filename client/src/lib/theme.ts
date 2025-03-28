import { create } from 'zustand';
import { ThemeId } from '../types';

type ThemeStore = {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  toggleThemeSelector: () => void;
  isThemeSelectorOpen: boolean;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  currentTheme: 'gold',
  isThemeSelectorOpen: false,
  setTheme: (theme) => set({ currentTheme: theme }),
  toggleThemeSelector: () => set((state) => ({ isThemeSelectorOpen: !state.isThemeSelectorOpen })),
}));

export const applyTheme = (theme: ThemeId) => {
  const root = document.documentElement;
  
  switch (theme) {
    case 'gold':
      root.style.setProperty('--primary', '46 57% 52%');
      root.style.setProperty('--primary-light', '46 79% 66%');
      root.style.setProperty('--accent', '190 100% 50%');
      break;
    case 'emerald':
      root.style.setProperty('--primary', '152 68% 40%');
      root.style.setProperty('--primary-light', '152 68% 50%');
      root.style.setProperty('--accent', '330 100% 70%');
      break;
    case 'platinum':
      root.style.setProperty('--primary', '0 0% 90%');
      root.style.setProperty('--primary-light', '0 0% 100%');
      root.style.setProperty('--primary-foreground', '0 0% 5%');
      root.style.setProperty('--accent', '220 70% 60%');
      break;
  }
};
