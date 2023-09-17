import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import querystring from 'querystringify';
import { Button, Heading, Stack, Text, Image } from '@chakra-ui/react';
import Orange from '../assets/orange-1218158_1280.jpeg';

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
            scope: 'user-read-private user-read-email playlist-modify-public user-top-read user-read-recently-played user-library-read playlist-modify-private',
            redirect_uri: window.location.href + 'callback',
            state: generateRandomString(16),
        });

    return (
        <>
            <Image
                src={Orange}
                position={'absolute'}
                right="-15%"
                bottom="-20%"
                zIndex={-1}
                width={'50%'}
                overflow={'hidden'}
            />
            <Stack
                justifyContent={'center'}
                height={'60%'}
                width={'40%'}
                spacing={7}
            >
                <Heading size="lg">
                    Log in to create a custom playlist with just an image!
                </Heading>
                <Text>
                    Take a picture of your face, our proprietary AI Emotion
                    Detection model tries to understand your mood and create a
                    playlist based off of it!!
                </Text>
                <Button
                    as={'a'}
                    href={'https://spotify-auth.onrender.com:8888/login'}
                    width={'50%'}
                    size={'lg'}
                    colorScheme="orange"
                >
                    Log In
                </Button>
            </Stack>
        </>
    );
};

export default Login;
