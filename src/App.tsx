// src/App.tsx
import React from "react";
import Router from "./Router";
import { AuthProvider } from "./context/AuthContext";
import Nav from "./components/nav";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
