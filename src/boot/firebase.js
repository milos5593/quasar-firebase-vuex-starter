import FIREBASE from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

FIREBASE.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_SORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
});

const AUTH = FIREBASE.auth();
const DB = FIREBASE.firestore();

// "async" is optional
export default ({ store }) => {
    AUTH.onAuthStateChanged(user => {
        if (user) {
            const { displayName, email, photoURL, uid } = user;
            store.dispatch('auth/UPDATE_USER', {
                displayName,
                email,
                photoURL,
                uid
            });
        }
    });
};

export { AUTH, DB };
