import { BrowserRouter, Route, Routes } from "react-router-dom";
import WhiteBoard from "./components/whiteboard";
import Main from "./components/main";
import Project from "./components/Project";
import Login from "./components/Login";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/whiteboard" element={<WhiteBoard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
