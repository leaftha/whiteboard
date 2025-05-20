// src/App.tsx
import React from "react";
import Router from "./Router";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
