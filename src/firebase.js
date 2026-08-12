import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBff-KrnIRvwv7KCbDiLLmLOWpUak_6ACA",
    authDomain: "shopeasy-d8c6d.firebaseapp.com",
    projectId: "shopeasy-d8c6d",
    storageBucket: "shopeasy-d8c6d.firebasestorage.app",
    messagingSenderId: "1025144662110",
    appId: "1:1025144662110:web:0afef2c550b246d91aeccf",
    measurementId: "G-2WRYCMXGXB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };