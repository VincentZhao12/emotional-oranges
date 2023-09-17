import React, { FC, FormEvent, useState } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { url } from 'inspector';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Compressor from 'compressorjs';

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
        <div>
            jhi
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image"
                    name="Upload Video"
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
                <button type="submit" disabled={!file}>
                    Generate Playlist
                </button>
            </form>
            hi
        </div>
    );
};

export default UploadImage;
