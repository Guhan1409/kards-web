import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        className={className} 
        viewBox="0 0 245 50" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Kards Logo"
    >
        {/* Box with a border inside */}
        <path d="M0 0 H 48 V 48 H 0 V 0 Z M 4 4 V 44 H 44 V 4 Z" />
        {/* Chevron */}
        <polyline points="32,12 16,24 32,36" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Text */}
        <text 
            x="60" 
            y="38" 
            fontFamily="Montserrat, sans-serif" 
            fontSize="40" 
            fontWeight="800"
            fill="currentColor"
        >
            KARDS
        </text>
    </svg>
);