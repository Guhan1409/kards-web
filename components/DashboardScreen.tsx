import React, { useState, useMemo } from 'react';
import { BusinessCard } from '../types';
import { CardPreview } from './CardPreview';
import { Logo } from './icons/Logo';

interface DashboardScreenProps {
  cards: BusinessCard[];
  onSelectCard: (card: BusinessCard) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ cards, onSelectCard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id-desc'); // 'id' is the creation date

  const filteredAndSortedCards = useMemo(() => {
    let filtered = cards.filter(card =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'id-desc':
          return b.id.localeCompare(a.id);
        case 'id-asc':
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });
  }, [cards, searchTerm, sortBy]);

  return (
    <div className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white min-h-screen">
      <header className="bg-kards-yellow text-black p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
           <Logo className="h-8 w-auto"/>
        </div>
      </header>
      
      <div className="p-4 max-w-md mx-auto pb-28">
        <div className="mb-6">
            <input 
                type="search"
                placeholder="Search by name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-kards-yellow focus:border-transparent outline-none transition"
            />
            <div className="mt-4">
                <label htmlFor="sort-by" className="text-sm text-gray-500 dark:text-gray-400">Sort by:</label>
                <select 
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-kards-yellow focus:border-transparent outline-none transition"
                >
                    <option value="id-desc">Date Added (Newest)</option>
                    <option value="id-asc">Date Added (Oldest)</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                </select>
            </div>
        </div>
        
        {filteredAndSortedCards.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedCards.map((card) => (
              <CardPreview key={card.id} card={card} onClick={() => onSelectCard(card)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">
              {cards.length > 0 ? 'No matching cards found.' : 'Your wallet is empty.'}
            </p>
            {cards.length === 0 && <p className="text-gray-500 dark:text-gray-400 mt-2">Tap the camera icon to scan your first card.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
