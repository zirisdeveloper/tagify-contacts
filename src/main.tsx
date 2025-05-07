
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Detect Android platform and set HTML class and meta tags
if (/Android/.test(navigator.userAgent)) {
  document.documentElement.classList.add('android');
  
  // Add meta tags to force proper input rendering
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  document.getElementsByTagName('head')[0].appendChild(meta);
  
  // Force hardware acceleration for the entire page
  document.body.style.transform = 'translateZ(0)';
  document.body.style.backfaceVisibility = 'hidden';
  
  // Add global styles for input fields on Android
  const style = document.createElement('style');
  style.textContent = `
    input, textarea {
      -webkit-user-select: text;
      user-select: text;
      -webkit-tap-highlight-color: transparent;
      -webkit-text-fill-color: currentColor;
    }
    
    input:focus, textarea:focus {
      -webkit-text-fill-color: currentColor !important;
      color: currentColor !important;
    }
    
    .android input, .android textarea {
      opacity: 1 !important;
      -webkit-text-fill-color: currentColor !important;
      color: currentColor !important;
    }
  `;
  document.head.appendChild(style);
}

createRoot(document.getElementById("root")!).render(<App />);
