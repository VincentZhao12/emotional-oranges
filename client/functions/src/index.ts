/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as logger from 'firebase-functions/logger';
const Jimp = require('jimp');

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import { initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
const path = require('path');
import { onObjectFinalized } from 'firebase-functions/v2/storage';

initializeApp();

exports.grayscaleImage = onObjectFinalized({ cpu: 2 }, async (event) => {
    // ...
    const fileBucket = event.data.bucket; // Storage bucket containing the file.
    const filePath = event.data.name; // File path in the bucket.
    const contentType = event.data.contentType; // File content type.

    // Exit if this is triggered on a file that is not an image.
    if (!contentType?.startsWith('image/')) {
        return logger.log('This is not an image.');
    }

    const fileName = path.basename(filePath);
    if (fileName.startsWith('gray_')) {
        return logger.log('Already grayscaled.');
    }

    const bucket = getStorage().bucket(fileBucket);
    const downloadResponse = await bucket.file(filePath).download();
    const imageBuffer = downloadResponse[0];

    Jimp.read(imageBuffer).then((image: any) => {
        image.greyscale();
        image.resize(180, 180);

        image.getBuffer(Jimp.MIME_PNG, (err: any, buffer: any) => {
            bucket.file('images/gray_' + fileName + '.png').save(buffer);
        });
    });
});
