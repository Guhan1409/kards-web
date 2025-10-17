import React from 'react';
import { BusinessCard } from '../types';

interface DeleteConfirmationModalProps {
    cardToDelete: BusinessCard;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ cardToDelete, onConfirm, onCancel }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-gray-900 dark:text-white">
                <h2 className="text-xl font-bold mb-2">Delete Card</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Are you sure you want to permanently delete the card for <span className="font-semibold">{cardToDelete.name}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
};