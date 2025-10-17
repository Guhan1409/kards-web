import React, { useState } from 'react';
import { BusinessCard } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PhoneIcon, EmailIcon, WebsiteIcon, BuildingIcon } from './icons/DetailIcons';
import { EditIcon } from './icons/EditIcon';
import { SaveIcon } from './icons/SaveIcon';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface DetailScreenProps {
  card: BusinessCard;
  onBack: () => void;
  onUpdate: (updatedCard: BusinessCard) => void;
  onDeleteRequest: (card: BusinessCard) => void;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isEditing?: boolean;
  onChange?: (value: string) => void;
  href?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, isEditing, onChange, href }) => {
  if (!value && !isEditing) return null;
  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200 dark:border-gray-800">
      <div className="text-kards-yellow mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {isEditing ? (
          <input 
            type="text"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full bg-transparent p-0 border-none text-gray-900 dark:text-white focus:ring-0"
          />
        ) : (
          href ? (
            <a
              href={href}
              className="text-gray-900 dark:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-kards-yellow rounded"
              target={label === 'Website' ? '_blank' : '_self'}
              rel={label === 'Website' ? 'noopener noreferrer' : undefined}
            >
              {value || 'N/A'}
            </a>
          ) : (
            <p className="text-gray-900 dark:text-white">{value || 'N/A'}</p>
          )
        )}
      </div>
    </div>
  );
};


export const DetailScreen: React.FC<DetailScreenProps> = ({ card, onBack, onUpdate, onDeleteRequest }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<BusinessCard>(card);

  const handleSave = () => {
    onUpdate(editedCard);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCard(card);
    setIsEditing(false);
  };
  
  const handleInputChange = (field: keyof BusinessCard, value: string) => {
    setEditedCard(prev => ({ ...prev, [field]: value }));
  };

  const getWebsiteUrl = (url: string): string => {
    if (!url) return '';
    if (!/^(https?:\/\/)/i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="bg-gray-50 dark:bg-black text-gray-900 dark:text-white min-h-screen animate-fade-in">
       <header className="bg-kards-yellow text-black p-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={isEditing ? handleCancel : onBack} className="p-2 -ml-2">
          {isEditing ? <XIcon className="w-6 h-6" /> : <ArrowLeftIcon className="w-6 h-6" />}
        </button>
        <h1 className="text-xl font-bold">{isEditing ? 'Edit Details' : 'Contact Details'}</h1>
        <button onClick={isEditing ? handleSave : () => setIsEditing(true)} className="p-2 -mr-2">
          {isEditing ? <SaveIcon className="w-6 h-6" /> : <EditIcon className="w-6 h-6" />}
        </button>
      </header>

      <div className="p-4 pb-24">
        <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6 shadow-sm">
          <img src={card.cardImage} alt="Business Card" className="rounded-lg mb-6 w-full object-cover" />
          {isEditing ? (
            <>
              <input type="text" value={editedCard.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full bg-transparent p-0 border-none text-3xl font-bold text-gray-900 dark:text-white focus:ring-0" />
              <input type="text" value={editedCard.title} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full bg-transparent p-0 border-none text-lg text-kards-yellow focus:ring-0" />
              <input type="text" value={editedCard.company} onChange={(e) => handleInputChange('company', e.target.value)} className="w-full bg-transparent p-0 border-none mt-1 text-gray-600 dark:text-gray-300 focus:ring-0" />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{card.name}</h2>
              <p className="text-kards-yellow text-lg">{card.title}</p>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{card.company}</p>
            </>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl px-6 shadow-sm">
          <DetailRow 
            icon={<PhoneIcon className="w-5 h-5" />} 
            label="Phone" 
            value={editedCard.phone} 
            isEditing={isEditing} 
            onChange={(val) => handleInputChange('phone', val)}
            href={!isEditing && editedCard.phone ? `tel:${editedCard.phone}` : undefined}
          />
          <DetailRow 
            icon={<EmailIcon className="w-5 h-5" />} 
            label="Email" 
            value={editedCard.email} 
            isEditing={isEditing} 
            onChange={(val) => handleInputChange('email', val)}
            href={!isEditing && editedCard.email ? `mailto:${editedCard.email}` : undefined}
          />
          <DetailRow 
            icon={<WebsiteIcon className="w-5 h-5" />} 
            label="Website" 
            value={editedCard.website} 
            isEditing={isEditing} 
            onChange={(val) => handleInputChange('website', val)}
            href={!isEditing && editedCard.website ? getWebsiteUrl(editedCard.website) : undefined}
          />
          <DetailRow 
            icon={<BuildingIcon className="w-5 h-5" />} 
            label="Address" 
            value={editedCard.address} 
            isEditing={isEditing} 
            onChange={(val) => handleInputChange('address', val)}
          />
        </div>
        
        <div className="mt-8 px-2">
            <button
                onClick={() => onDeleteRequest(card)}
                className="w-full flex items-center justify-center space-x-2 text-red-500 disabled:text-gray-500 hover:text-red-600 dark:hover:text-red-400 font-semibold py-3 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 disabled:bg-gray-500/10 transition-colors"
                disabled={isEditing}
                aria-label="Delete Card"
            >
                <TrashIcon className="w-5 h-5" />
                <span>Delete Card</span>
            </button>
        </div>
      </div>
    </div>
  );
};