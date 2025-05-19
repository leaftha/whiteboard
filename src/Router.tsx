// src/Router.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Auth/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Whiteboard from './components/Auth/Whiteboard';
import SchedulePage from './schedule/SchedulePage';
import './App.css';
import './index.css';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
