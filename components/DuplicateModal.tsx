import React from 'react';
import { BusinessCard } from '../types';

interface DuplicateModalProps {
    newCard: BusinessCard;
    existingCard: BusinessCard;
    onResolve: (resolution: 'update' | 'new') => void;
    onCancel: () => void;
}

export const DuplicateModal: React.FC<DuplicateModalProps> = ({ newCard, existingCard, onResolve, onCancel }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-gray-900 dark:text-white">
                <h2 className="text-xl font-bold mb-2">Duplicate Card Found</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    A card for <span className="font-semibold">{existingCard.name}</span> at <span className="font-semibold">{existingCard.company}</span> already exists.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    What would you like to do?
                </p>
                <div className="space-y-3">
                    <button
                        onClick={() => onResolve('update')}
                        className="w-full bg-kards-yellow text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors"
                    >
                        Update Existing Card
                    </button>
                    <button
                        onClick={() => onResolve('new')}
                        className="w-full bg-gray-200 dark:bg-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Save as New Card
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full text-center text-sm text-gray-500 hover:underline mt-2"
                    >
                        Discard Scan
                    </button>
                </div>
            </div>
        </div>
    );
};
