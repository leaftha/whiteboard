import { BrowserRouter, Route, Routes } from "react-router-dom";
import WhiteBoard from "./Whiteboard";
import Main from "./components/main";
import Project from "./components/Project";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/whiteboard" element={<WhiteBoard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
