import React, { FC, FormEvent, useState } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { url } from 'inspector';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Compressor from 'compressorjs';
import { Button, Stack, Image, Heading } from '@chakra-ui/react';
import Orange from '../assets/orange-1218158_1280.jpeg';

interface UploadImageProps {}

const UploadImage: FC<UploadImageProps> = () => {
    const [file, setFile] = useState<any>(undefined);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const date = Date.now();
        const imageRef = ref(storage, `images/${date}`);

        localStorage.setItem('img', date + '');
        try {
            setDoc(doc(db, 'files', '' + date), {
                done: false,
            });
            await uploadBytes(imageRef, file);
            navigate('/playlist');
        } catch (e) {
            console.log(e);
        }

        console.log('uploaded');
    };
    return (
        <div
            style={{
                height: '40%',
                width: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                src={Orange}
                position={'absolute'}
                right="20%"
                bottom="-20%"
                zIndex={-1}
                width={'50%'}
                overflow={'none'}
            />
            <form onSubmit={handleSubmit}>
                <Stack justifyContent={'center'} height={'100%'} spacing={8}>
                    <Heading>
                        Upload a picture to generate your custom playlist!
                    </Heading>
                    <input
                        type="file"
                        accept="image"
                        name="Upload Image"
                        onChange={e => {
                            if (e.target.files) {
                                const image = e.target.files[0];
                                new Compressor(image, {
                                    quality: 0.1, // 0.6 can also be used, but its not recommended to go below.
                                    success: compressedResult => {
                                        // compressedResult has the compressed file.
                                        // Use the compressed file to upload the images to your server.
                                        setFile(compressedResult);
                                        console.log('compress');
                                    },
                                });
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        colorScheme="orange"
                        isDisabled={!file}
                        width="75%"
                    >
                        Generate Playlist
                    </Button>
                </Stack>
            </form>
        </div>
    );
};

export default UploadImage;
