import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import querystring from 'querystringify';

interface LoginProps {}

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECERT = process.env.REACT_APP_SPOTIFY_CLIENT_SECERT;

const generateRandomString = (length: number) => {
    let text = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const Login: FC<LoginProps> = () => {
    const auth_url =
        'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'token',
            client_id: CLIENT_ID,
            scope: 'user-read-private user-read-email playlist-modify-public user-top-read user-read-recently-played user-library-read',
            redirect_uri: window.location.href + 'callback',
            state: generateRandomString(16),
        });

    const { accessToken, setAccessToken } = useAuth();

    const findData = async () => {
        const res = await axios('', {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });
        console.log(res);
    };

    return (
        <>
            {/* <button onClick={findData}> hi</button> */}
            <a href={auth_url}>log in</a>
        </>
    );
};

export default Login;
