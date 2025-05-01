// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App.tsx를 불러온다

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
