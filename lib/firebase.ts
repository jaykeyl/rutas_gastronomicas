import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import firebaseCompat from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCBgZuxn1K2ABikBCga-0NjRtNFGMMui48',
  authDomain: 'rutasgastronomicas.firebaseapp.com',
  projectId: 'rutasgastronomicas',
  storageBucket: 'rutasgastronomicas.appspot.com',
  messagingSenderId: '970592502851',
  appId: '1:970592502851:web:1bd4f47e4f5a3ee1ec40f6',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

if (!firebaseCompat.apps.length) {
  firebaseCompat.initializeApp(firebaseConfig);
}

export const auth = firebaseCompat.auth();

let _auth: Auth | null = null;
export const getAuthInstance = () => {
  if (!_auth) _auth = getAuth(app);
  return _auth;
};

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
