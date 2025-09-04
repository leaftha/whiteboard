import { Route, Routes } from "react-router-dom";
import WhiteBoard from "./components/whiteboard";
import Main from "./components/main";
import Project from "./components/Project";
import Login from "./components/Login";
import SignUp from "./components/signup";
import MyProject from "./components/Myproject";
import SchedulePage from "./components/SchedulePage"; // 일정 관리 페이지

import "./App.css";
import "./index.css";

import "./App.css";
const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/projects" element={<MyProject />} />
      <Route path="/project/:id" element={<Project />} />
      <Route path="/whiteboard/:roomId" element={<WhiteBoard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/schedule/:id" element={<SchedulePage />} />
    </Routes>
  );
};

export default AppRouter;
