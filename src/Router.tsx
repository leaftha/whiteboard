import { BrowserRouter, Route, Routes } from "react-router-dom";
import WhiteBoard from "./Whiteboard";
import Main from "./main";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/whiteboard" element={<WhiteBoard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
