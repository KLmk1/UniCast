import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import UniCast from './unicast';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // Ensure #root exists in your index.html
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UniCast />
    </BrowserRouter>
  </React.StrictMode>
);
