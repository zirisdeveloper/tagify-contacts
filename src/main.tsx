
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced Android detection and keyboard handling
if (/Android/.test(navigator.userAgent)) {
  document.documentElement.classList.add('android');
  
  // Set viewport meta for better input handling
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, height=device-height';
  document.getElementsByTagName('head')[0].appendChild(meta);
  
  // Add enhanced global styles for Android input fields
  const style = document.createElement('style');
  style.textContent = `
    input, textarea {
      -webkit-appearance: none;
      appearance: none;
      -webkit-user-select: text !important;
      user-select: text !important;
      background-color: transparent;
      caret-color: currentColor;
    }
    
    .android input:focus,
    .android textarea:focus,
    .android [contenteditable]:focus {
      -webkit-user-select: text !important;
      user-select: text !important;
      caret-color: currentColor;
      opacity: 1 !important;
    }
    
    /* Force Android to show the caret */
    .android input, .android textarea {
      caret-color: currentColor !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);
  
  // Handle keyboard visibility
  document.addEventListener('focusin', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      // Scroll to the input field when focused
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
