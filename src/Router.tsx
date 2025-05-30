import { BrowserRouter, Route, Routes } from "react-router-dom";
import WhiteBoard from "./components/whiteboard";
import Main from "./components/main";
import Project from "./components/Project";
import Login from "./components/Login";
import SignUp from "./components/signup";
import MyProject from "./components/Myproject";

import Main from "./components/main"; // 메인 페이지
import Project from "./components/Project"; // 프로젝트 상세
import Whiteboard from "./components/whiteboard"; // 화이트보드
import Login from "./components/Login"; // 로그인
import SignUp from "./components/signup"; // 회원가입
import SchedulePage from "./schedule/SchedulePage"; // 일정 관리 페이지

import "./App.css";
import "./index.css";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/projects" element={<MyProject />} />
      <Route path="/project/:id" element={<Project />} />
      <Route path="/whiteboard/:roomId" element={<WhiteBoard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default AppRouter;
