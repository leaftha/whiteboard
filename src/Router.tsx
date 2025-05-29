import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Main from './components/main'; // 메인 페이지
import Project from './components/Project'; // 프로젝트 상세
import Whiteboard from './components/whiteboard'; // 화이트보드
import Login from './components/Login'; // 로그인
import SignUp from './components/signup'; // 회원가입
import SchedulePage from './schedule/SchedulePage'; // 일정 관리 페이지

import './App.css';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
