
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure the DOM is fully loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById("root")!).render(<App />);
});
