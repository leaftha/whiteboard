// src/App.tsx
import React from 'react';
import Router from './Router';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router />
        </AuthProvider>
    );
}

export default App;
