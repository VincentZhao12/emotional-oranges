import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import { AuthProvider } from './contexts/AuthContext';
import UploadImage from './pages/UploadImage';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/callback" element={<Callback />} />
                        <Route path="/upload" element={<UploadImage />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
