import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import { AuthProvider } from './contexts/AuthContext';
import UploadImage from './pages/UploadImage';
import Playlist from './pages/Playlist';
import Navbar from './components/Navbar';
import { ChakraProvider, Stack } from '@chakra-ui/react';

function App() {
    return (
        <ChakraProvider>
            <div className="App" style={{ height: '100vh' }}>
                <BrowserRouter>
                    <AuthProvider>
                        <Navbar />
                        <Stack alignItems={'center'} height={'100%'}>
                            <Routes>
                                <Route path="/" element={<Login />} />
                                <Route
                                    path="/callback"
                                    element={<Callback />}
                                />
                                <Route
                                    path="/upload"
                                    element={<UploadImage />}
                                />
                                <Route
                                    path="/playlist"
                                    element={<Playlist />}
                                />
                            </Routes>
                        </Stack>
                    </AuthProvider>
                </BrowserRouter>
            </div>
        </ChakraProvider>
    );
}

export default App;
