import React, { FC, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import querystringify from 'querystringify';
import { useNavigate } from 'react-router-dom';

interface CallbackProps {}

const Callback: FC<CallbackProps> = () => {
    const { accessToken, setAccessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // const spotifyToken = getTokenFromURL();
        // window.location.hash = '';
        // console.log(spotifyToken);
        console.log(window.location.hash);
        const parsed: any = querystringify.parse(window.location.hash);
        console.log(parsed);
        setAccessToken(parsed.access_token);
        // if (parsed.access_token) navigate('/upload');
        // else navigate('/');
    }, []);

    return (
        <>
            <button onClick={() => navigate('/upload')}>continue</button>
        </>
    );
};

export default Callback;
