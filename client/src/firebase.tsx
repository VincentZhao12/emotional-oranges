import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: 'the-emotional-oranges.firebaseapp.com',
    projectId: 'the-emotional-oranges',
    storageBucket: 'the-emotional-oranges.appspot.com',
    messagingSenderId: '617676983748',
    appId: '1:617676983748:web:43f066fb6157699f91e891',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
