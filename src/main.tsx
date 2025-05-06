
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Detect Android platform and set HTML class
if (/Android/.test(navigator.userAgent)) {
  document.documentElement.classList.add('android');
}

createRoot(document.getElementById("root")!).render(<App />);
