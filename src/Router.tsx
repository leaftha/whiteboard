import { BrowserRouter, Route, Routes } from "react-router-dom";
import WhiteBoard from "./Whiteboard";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" />
        <Route path="/whiteboard" element={<WhiteBoard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
