import React, { FC, FormEvent, useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { url } from 'inspector';

interface UploadImageProps {}

const UploadImage: FC<UploadImageProps> = () => {
    const [file, setFile] = useState<any>(undefined);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const imageRef = ref(storage, `images/${Date.now()}`);

        let imageUrl: string | undefined = '';
        try {
            await uploadBytes(imageRef, file);
            imageUrl = await getDownloadURL(imageRef);
        } catch (e) {
            console.log(e);
        }

        localStorage.setItem('img', imageUrl);

        console.log('uploaded');
    };

    return (
        <div>
            jhi
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/png"
                    name="Upload Video"
                    onChange={(e) => {
                        if (e.target.files) {
                            const file = e.target.files[0];
                            setFile(file);
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
