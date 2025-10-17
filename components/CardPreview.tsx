import React from 'react';
import { BusinessCard } from '../types';
import { UserIcon } from './icons/UserIcon';

interface CardPreviewProps {
  card: BusinessCard;
  onClick: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-kards-yellow/50 transition-all duration-200 shadow-sm dark:shadow-none"
    >
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
        <UserIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
      </div>
      <div>
        <h3 className="text-gray-900 dark:text-white font-semibold text-lg">{card.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{card.company}</p>
      </div>
    </div>
  );
};
