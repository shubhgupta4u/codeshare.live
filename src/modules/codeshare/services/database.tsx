import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    // apiKey: "AIzaSyAAx_knJ_qqxPkJQ_xoIZnxt_c6gb6Wdys",
    authDomain: "codeshare-live.firebaseapp.com",
    projectId: "codeshare-live",
    storageBucket: "codeshare-live.appspot.com",
    messagingSenderId: "288513680516",
    // appId: "1:1072574112522:web:65fc4e184aed9894dc90f3",
    databaseURL: "https://codeshare-live-default-rtdb.asia-southeast1.firebasedatabase.app"  
};

// Initialize firebase app.
const app = initializeApp(firebaseConfig);

// Initialize firebase database and get the reference of firebase database object.
export const database = getDatabase(app);
