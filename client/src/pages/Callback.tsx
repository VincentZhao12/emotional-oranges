import React, { FC, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import querystringify from 'querystringify';
import axios from 'axios';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECERT = process.env.REACT_APP_SPOTIFY_CLIENT_SECERT;

interface CallbackProps {}

interface SongData {
    valence: number;
    energy: number;
    id: string;
}

const getTokenFromURL = () => {
    return window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial: any, item) => {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
            return initial;
        }, {});
};

const Callback: FC<CallbackProps> = () => {
    const { accessToken, setAccessToken } = useAuth();
    const [angry, setAngry] = useState<SongData[]>([]);
    const [happy, setHappy] = useState<SongData[]>([]);
    const [disgusted, setDisgusted] = useState<SongData[]>([]);
    const [fearful, setFearful] = useState<SongData[]>([]);
    const [neutral, setNeutral] = useState<SongData[]>([]);
    const [sad, setSad] = useState<SongData[]>([]);
    const [surprised, setSurprised] = useState<SongData[]>([]);

    useEffect(() => {
        // const spotifyToken = getTokenFromURL();
        // window.location.hash = '';
        // console.log(spotifyToken);
        console.log(window.location.hash);
        const parsed: any = querystringify.parse(window.location.hash);
        console.log(parsed);
        setAccessToken(parsed.access_token);
    }, []);

    const fectchEndpoint = async (url: string) => {
        return await axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
            data:
                'grant_type=client_credentials&client_id=' +
                CLIENT_ID +
                '&client_secret=' +
                CLIENT_SECERT,
        });
    };

    const findData = async () => {
        const [top50, saved, topArtists] = await Promise.all([
            fectchEndpoint(
                'https://api.spotify.com/v1/me/top/artists?limit=50&offset=0',
            ),
            fectchEndpoint('https://api.spotify.com/v1/me/tracks?limit=50'),
            fectchEndpoint(
                'https://api.spotify.com/v1/me/top/artists?limit=50',
            ),
        ]);
        let song_ids = top50.data.items.map((item: any) => item.id);
        const artistIds = topArtists.data.items.map((artist: any) => artist.id);

        const topArtistsSongs = await Promise.all(
            artistIds.map((artistId: any) =>
                fectchEndpoint(
                    'https://api.spotify.com/v1/artists/' +
                        artistId +
                        '/top-tracks?market=ES',
                ),
            ),
        );

        saved.data.items.forEach((item: any) => {
            if (song_ids.indexOf(item.track.id) == -1)
                song_ids.push(item.track.id);
        });

        topArtistsSongs.forEach((tracks) => {
            tracks.data.tracks.forEach((track: any) => {
                if (song_ids.indexOf(track.id) == -1) song_ids.push(track.id);
            });
        });

        console.log(song_ids);

        let happy = [];
        let angry = [];
        let disgusted = [];
        let fearful = [];
        let neutral = [];
        let sad = [];
        let surprised = [];

        const songData = song_ids.map((song: any) => ({
            valence: song.data.valence,
            energy: song.data.energy,
            id: song.data.id,
        }));

        songData.forEach((song: SongData) => {});

        // console.log(songData);
    };
    return (
        <>
            {accessToken}

            <button onClick={findData}> hi</button>
        </>
    );
};

export default Callback;
