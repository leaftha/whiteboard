// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // App 컴포넌트 임포트
import './index.css';  // 전역 스타일 임포트

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
