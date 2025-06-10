
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Favicon from "react-favicon"
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Favicon url="/Sppj.png" />
    <App />
  </StrictMode>
);
