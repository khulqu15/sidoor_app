import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDcqLYLTC7rbTSdhkLBt-aVWNPYIxkG8Uc",
    authDomain: "socleanbot-app12.firebaseapp.com",
    databaseURL: "https://socleanbot-app12-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "socleanbot-app12",
    storageBucket: "socleanbot-app12.appspot.com",
    messagingSenderId: "395410086023",
    appId: "1:395410086023:web:8fa4d9c9ed249325a70022"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app);
export { app, auth, db };
