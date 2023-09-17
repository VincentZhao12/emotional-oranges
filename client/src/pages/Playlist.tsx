import React, { FC, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { LayersModel } from '@tensorflow/tfjs';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import modelFile from '../model/model.json';
import { doc, onSnapshot } from 'firebase/firestore';
import {
    Stack,
    Image as Img,
    HStack,
    Text,
    useMediaQuery,
} from '@chakra-ui/react';

interface PlaylistProps {}

interface SongData {
    valence: number;
    energy: number;
    id: string;
}

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECERT = process.env.REACT_APP_SPOTIFY_CLIENT_SECERT;

interface Song {
    id: string;
    uri: string;
    name: string;
    artist: string;
    album: string;
    albumArt: string;
}

const Playlist: FC<PlaylistProps> = () => {
    const [model, setModel] = useState<LayersModel | null>(null);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const [predictedClass, setPredictedClass] = useState(null);
    const [angry, setAngry] = useState<String[]>([]);
    const [happy, setHappy] = useState<String[]>([]);
    const [disgusted, setDisgusted] = useState<String[]>([]);
    const [fearful, setFearful] = useState<String[]>([]);
    const [neutral, setNeutral] = useState<String[]>([]);
    const [sad, setSad] = useState<String[]>([]);
    const [surprised, setSurprised] = useState<String[]>([]);
    const [pl, setPl] = useState<Song[]>([]);
    const [accessToken, setAccessToken] = useState<string>(
        localStorage.getItem('token') || '',
    );
    const [link, setLink] = useState<string>('');
    const [img, setImg] = useState<string>('');
    const [isLargerThan900] = useMediaQuery('(min-width: 900px)');

    useEffect(() => {
        findData();
        (async () => {
            const storageRef = ref(
                storage,
                'images/' + localStorage.getItem('img'),
            );
            const url = await getDownloadURL(storageRef);
            setImg(url);
        })();
    }, []);

    useEffect(() => {
        setAccessToken(localStorage.getItem('token') || '');
        onSnapshot(
            doc(db, 'files', localStorage.getItem('img') || ''),
            doc => {
                if (doc.data()?.done) {
                    setTimeout(loadImg, 1000);
                    console.log('image converted');
                }
            },
            err => console.log('im a fucking dumbass'),
        );
    }, [happy]);

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

        topArtistsSongs.forEach(tracks => {
            tracks.data.tracks.forEach((track: any) => {
                if (song_ids.indexOf(track.id) == -1) song_ids.push(track.id);
            });
        });

        let happy: String[] = [];
        let angry: String[] = [];
        let disgusted: String[] = [];
        let fearful: String[] = [];
        let neutral: String[] = [];
        let sad: String[] = [];
        let surprised: String[] = [];

        let songsStrings: String[] = [];

        let count = 0;
        let currStr = '';

        song_ids.forEach((song: string) => {
            count++;
            currStr += song + '%2C';
            if (count === 100) {
                songsStrings.push(currStr.substring(0, currStr.length - 3));
                count = 0;
                currStr = '';
            }
        });

        console.log(songsStrings);

        const songsFeatures = await Promise.all(
            songsStrings.map(string =>
                fectchEndpoint(
                    'https://api.spotify.com/v1/audio-features?ids=' + string,
                ),
            ),
        );
        console.log(songsFeatures);

        let songData: SongData[] = [];

        songsFeatures.forEach((songs: any) => {
            songs.data.audio_features.forEach((data: any) => {
                if (data)
                    songData.push({
                        valence: data.valence,
                        energy: data.energy,
                        id: data.id,
                    });
            });
        });

        console.log(songData);

        songData.forEach((song: SongData) => {
            if (song.valence <= 0.25) {
                if (song.energy >= 0.75) {
                    angry.push(song.id);
                    fearful.push(song.id);
                }

                if (song.energy <= 0.25) {
                    sad.push(song.id);
                }

                if (song.energy <= 0.75 && song.energy >= 0.25) {
                    disgusted.push(song.id);
                }
            }

            if (song.valence <= 0.75 && song.valence >= 0.25) {
                if (song.energy <= 0.75 && song.energy >= 0.25) {
                    neutral.push(song.id);
                }
            }

            if (song.valence <= 0.75) {
                if (song.energy >= 0.5) {
                    happy.push(song.id);
                }
                if (song.energy >= 0.75) {
                    surprised.push(song.id);
                }
            }
        });
        setAngry(angry);
        setHappy(happy);
        setSad(sad);
        setDisgusted(disgusted);
        setFearful(fearful);
        setNeutral(neutral);
        setSurprised(surprised);
    };

    const createHTMLImageElement = (imageSrc: any) => {
        return new Promise(resolve => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imageSrc;
            img.onload = () => resolve(img);
        });
    };

    const loadImg = async () => {
        setLoading1(true);

        const model_url = window.location.origin + '/model.json';
        const model = await tf.loadLayersModel(model_url);

        const storageRef = ref(
            storage,
            'images/gray_' + localStorage.getItem('img') + '.png',
        );
        const url = await getDownloadURL(storageRef);

        const image: any = await createHTMLImageElement(url);

        // tf.tidy for automatic memory cleanup
        // const [predictedClass, confidence] =
        // tf.tidy(async() => {
        const tensorImg = tf.browser
            .fromPixels(image)
            .toFloat()
            .expandDims(0);

        const result: any = model?.predict(tensorImg);

        console.log(tensorImg.shape);
        console.log(result.dataSync());

        if (!result) return [0, 0];

        const predictions = result.dataSync();
        const predicted_index = result
            ?.as1D()
            .argMax()
            .dataSync()[0];

        const confidence = Math.round(predictions[predicted_index] * 100);

        // return [predictedClass, confidence];
        // });

        setPredictedClass(predicted_index);
        setConfidence(confidence);
        setLoading1(false);

        let playlist = [];
        let chosenEmotion: String[] = [];

        if (predicted_index !== null && pl.length == 0) {
            switch (predicted_index) {
                case 0:
                    chosenEmotion = happy;
                    break;
                case 1:
                    chosenEmotion = angry; //and fearful
                    break;
                case 2:
                    chosenEmotion = disgusted;
                    break;
                case 3:
                    chosenEmotion = neutral;
                    break;
                case 4:
                    chosenEmotion = sad;
                    break;
                default:
                    chosenEmotion = surprised;
                    break;
            }
            console.log(happy);

            let selectedIndexes: number[] = [];
            let iterationLimit = 1000000;
            while (playlist.length < 20) {
                let index = (Math.random() * chosenEmotion.length) | 0;
                let notRepeated = true;
                for (let i = 0; i < selectedIndexes.length; i++) {
                    if (selectedIndexes[i] === index) {
                        notRepeated = false;
                        break;
                    }
                }

                if (notRepeated) {
                    selectedIndexes.push(index);
                    playlist.push(chosenEmotion[index]);
                }

                if (iterationLimit === 0) {
                    break;
                }
                iterationLimit -= 1;
            }
            try {
                const request = await Promise.all(
                    playlist.map(track =>
                        fectchEndpoint(
                            'https://api.spotify.com/v1/tracks/' + track,
                        ),
                    ),
                );
                console.log(request);

                const list = request.map(track => {
                    console.log(track.data.artists[0].name);
                    return {
                        name: track.data.name,
                        artist: track.data.artists[0].name,
                        album: track.data.album.name,
                        albumArt: track.data.album.images[2].url,
                        uri: track.data.uri,
                        id: track.data.id,
                    };
                });

                setPl(list);
            } catch (e) {
                console.log(e);
                return;
            }
        }
    };

    return (
        <Stack width={isLargerThan900 ? '40%' : '100%'}>
            <Text>
                <b>Your New Playlist:</b>
            </Text>
            <Img width="100%" src={img || ''} />
            {!loading1 &&
                !loading2 &&
                pl.map((song: Song) => (
                    <>
                        <HStack justifyContent={'flex-start'} width={'80%'}>
                            <Img src={song.albumArt} alt="" />
                            <Text>{song.name} | </Text>
                            <Text>{song.album} |</Text>
                            <Text>{song.artist} </Text>
                        </HStack>
                        <hr />
                    </>
                ))}
        </Stack>
    );
};

export default Playlist;
