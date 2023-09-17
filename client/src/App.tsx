import React, { useState, useEffect, Fragment }from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Callback from './pages/Callback';
import { AuthProvider } from './contexts/AuthContext';
import UploadImage from './pages/UploadImage';
import * as tf from "@tensorflow/tfjs";
import {GraphModel} from "@tensorflow/tfjs";


const [model, setModel] = useState<GraphModel>(null);
const [classLabels, setClassLabels] = useState(null);

useEffect(() => {
    const loadModel = async () => {
        const model_url = '/Image Mood Model/model.json';

        const model = await tf.loadGraphModel(model_url);

        setModel(model);
    };
    loadModel();
},[]);

const [loading, setLoading] = useState(false);
const [confidence, setConfidence] = useState(null);
const [predictedClass, setPredictedClass] = useState(null);


const readImageFile = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.readAsDataURL(file);
    });
};

const createHTMLImageElement = (imageSrc) => {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => resolve(img);

        img.src = imageSrc;
    });
};

const handleImageChange = async (files) => {
    if (files.length === 0) {
        setConfidence(null);
        setPredictedClass(null);
    }

    if (files.length === 1) {
        setLoading(true);

        const imageSrc = await readImageFile(files[0]);
        const image = await createHTMLImageElement(imageSrc);

        // tf.tidy for automatic memory cleanup
        const [predictedClass, confidence] = tf.tidy(() => {
            const tensorImg = tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
            const result = model.predict(tensorImg);

            const predictions = result.dataSync();
            const predicted_index = result.as1D().argMax().dataSync()[0];

            const predictedClass = classLabels[predicted_index];
            const confidence = Math.round(predictions[predicted_index] * 100);

            return [predictedClass, confidence];
        });

        setPredictedClass(predictedClass);
        setConfidence(confidence);
        setLoading(false);
    }
};