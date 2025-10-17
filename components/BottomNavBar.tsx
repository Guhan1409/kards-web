import React from 'react';
import { AppView } from '../types';
import { CollectionIcon } from './icons/CollectionIcon';
import { CameraIcon } from './icons/CameraIcon';
import { MoonIcon, SunIcon } from './icons/ThemeIcons';

interface BottomNavBarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const NavButton: React.FC<{
  label: string;
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ label, onClick, isActive, children }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-3 pb-2 transition-colors duration-200 ${
        isActive ? 'text-kards-yellow' : 'text-gray-500 hover:text-gray-400 dark:hover:text-gray-300'
      }`}
      aria-label={label}
    >
      {children}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setView, theme, toggleTheme }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 flex justify-around items-center max-w-md mx-auto">
      <NavButton label="Kards" onClick={() => setView(AppView.Dashboard)} isActive={currentView === AppView.Dashboard}>
        <CollectionIcon className="w-6 h-6" />
      </NavButton>
      
      {/* The large center scan button is separate and overlays the bar */}
      <div className="flex-shrink-0">
        <button
          onClick={() => setView(AppView.Scan)}
          className="w-16 h-16 bg-kards-yellow rounded-full flex items-center justify-center text-black shadow-lg shadow-yellow-500/30 hover:bg-yellow-300 transition-all duration-200 transform -translate-y-6"
          aria-label="Scan new card"
        >
          <CameraIcon className="w-8 h-8" />
        </button>
      </div>

      <NavButton label={theme === 'dark' ? 'Light' : 'Dark'} onClick={toggleTheme} isActive={false}>
        {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
      </NavButton>
    </nav>
  );
};
