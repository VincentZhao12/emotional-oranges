import React, { FC, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import querystringify from 'querystringify';
import { useNavigate } from 'react-router-dom';

interface CallbackProps {}

const Callback: FC<CallbackProps> = () => {
    const { accessToken, setAccessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const parsed: any = querystringify.parse(window.location.hash);
        localStorage.setItem('token', parsed.access_token);
        console.log(parsed);

        setTimeout(() => {
            if (parsed.access_token) navigate('/upload');
            else navigate('/');
        }, 100);
    }, []);

    return (
        <>
            <button onClick={() => navigate('/upload')}>continue</button>
        </>
    );
};

export default Callback;
