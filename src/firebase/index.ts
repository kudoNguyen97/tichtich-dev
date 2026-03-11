// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    // apiKey: 'AIzaSyCL6B0O4yinKVHzp15QJivGYvgUc_z85uM',
    // authDomain: 'tichtich-kudo.firebaseapp.com',
    // projectId: 'tichtich-kudo',
    // storageBucket: 'tichtich-kudo.firebasestorage.app',
    // messagingSenderId: '839764689523',
    // appId: '1:839764689523:web:33d5b4f33b5f13c7776006',
    // measurementId: 'G-LYMPWV1C1N',
    apiKey: 'AIzaSyCvTimXRqla_whza5xuRVSSOnAPbWRXm_s',
    authDomain: 'tichtichvn-dev.firebaseapp.com',
    projectId: 'tichtichvn-dev',
    storageBucket: 'tichtichvn-dev.firebasestorage.app',
    messagingSenderId: '464983822805',
    appId: '1:464983822805:web:c4fb943d783850f9192d5c',
    measurementId: 'G-H1W6LNLJMG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;
