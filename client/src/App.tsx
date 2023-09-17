import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import { AuthProvider } from './contexts/AuthContext';
import UploadImage from './pages/UploadImage';
import Playlist from './pages/Playlist';
import Navbar from './components/Navbar';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Navbar />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/callback" element={<Callback />} />
                            <Route path="/upload" element={<UploadImage />} />
                            <Route path="/playlist" element={<Playlist />} />
                        </Routes>
                    </div>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
