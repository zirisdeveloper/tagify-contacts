
import React from 'react';

interface AppIconSvgProps {
  className?: string;
}

const AppIconSvg: React.FC<AppIconSvgProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 108 108" 
      className={className}
      aria-hidden="true"
    >
      <rect width="108" height="108" fill="#0B5681" />
      <circle cx="54" cy="54" r="30" fill="#FFFFFF" />
      <circle cx="54" cy="54" r="25" fill="#0B5681" />
      <circle cx="54" cy="38" r="10" fill="#FFFFFF" />
      <path d="M42,60 L66,60 Q72,60 72,66 L72,70 L36,70 L36,66 Q36,60 42,60" fill="#FFFFFF" />
      <path d="M54,50 L58,56 L50,56 Z" fill="#0B5681" />
      <path d="M54,54 L54,70" fill="#0B5681" />
    </svg>
  );
};

export default AppIconSvg;
