import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3iP6TOJSI6sD99QXZ9nx96GyUq9oGqRA",
  authDomain: "at-marker-extension-dev.firebaseapp.com",
  projectId: "at-marker-extension-dev",
  storageBucket: "at-marker-extension-dev.appspot.com",
  messagingSenderId: "789194274107",
  appId: "1:789194274107:web:09b0ef0e8fa68b22b6b31e",
  measurementId: "G-K2GQ9LKX5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
