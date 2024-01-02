// firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyByA2NbnXpFg4yM_h8pug8WgD9hnLyQv4g",
    authDomain: "ac-service-34683.firebaseapp.com",
    databaseURL: "https://ac-service-34683-default-rtdb.firebaseio.com",
    projectId: "ac-service-34683",
    storageBucket: "ac-service-34683.appspot.com",
    messagingSenderId: "372535984207",
    appId: "1:372535984207:web:0dcbc759cee5f2a85aea3a",
    measurementId: "G-1XH4ZTDPQG",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
