
import React from 'react';

interface AppIconSvgProps {
  className?: string;
}

const AppIconSvg: React.FC<AppIconSvgProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      aria-hidden="true"
    >
      {/* This SVG will be replaced by the uploaded image in the native app,
          but we're keeping the SVG version for web display */}
      <rect width="200" height="200" fill="#0B5681" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#FFFFFF" strokeWidth="8" />
      <circle cx="100" cy="100" r="65" fill="none" stroke="#FFFFFF" strokeWidth="4" />
      <circle cx="100" cy="70" r="20" fill="#FFFFFF" />
      <path d="M70,115 L130,115 Q140,115 140,125 L140,145 L60,145 L60,125 Q60,115 70,115" fill="#FFFFFF" />
      <path d="M100,90 L100,145" stroke="#0B5681" strokeWidth="6" />
      <path d="M100,90 L100,105 L110,115 L90,115 Z" fill="#0B5681" />
    </svg>
  );
};

export default AppIconSvg;
