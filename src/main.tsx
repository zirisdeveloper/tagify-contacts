
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Basic Android detection and simple fixes
if (/Android/.test(navigator.userAgent)) {
  document.documentElement.classList.add('android');
  
  // Set viewport meta for better input handling
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.getElementsByTagName('head')[0].appendChild(meta);
  
  // Add simple global styles for Android input fields
  const style = document.createElement('style');
  style.textContent = `
    input, textarea {
      -webkit-appearance: none;
      appearance: none;
      -webkit-user-select: text;
      user-select: text;
      background-color: transparent;
    }
    
    .android input:focus,
    .android textarea:focus,
    .android [contenteditable]:focus {
      -webkit-user-select: text;
      user-select: text;
      caret-color: currentColor;
    }
  `;
  document.head.appendChild(style);
}

createRoot(document.getElementById("root")!).render(<App />);
