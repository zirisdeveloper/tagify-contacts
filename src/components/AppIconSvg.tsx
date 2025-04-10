
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
      {/* Blue background circle */}
      <circle cx="100" cy="100" r="100" fill="#0C5075" />
      
      {/* Outer white circle */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="#FFFFFF" strokeWidth="8" />
      
      {/* Inner white circle */}
      <circle cx="100" cy="100" r="70" fill="none" stroke="#FFFFFF" strokeWidth="6" />
      
      {/* Person head */}
      <circle cx="100" cy="75" r="25" fill="#FFFFFF" />
      
      {/* Person body */}
      <path d="M60,130 C60,105 140,105 140,130 L140,155 L60,155 Z" fill="#FFFFFF" />
      
      {/* Person tie */}
      <path d="M100,100 L110,115 L100,150 L90,115 Z" fill="#0C5075" />
    </svg>
  );
};

export default AppIconSvg;
