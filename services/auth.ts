import firebase from '../lib/firebase';
import { auth } from '../lib/firebase';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export async function signUpEmail(email: string, password: string, displayName?: string) {
  if (!email || !password) throw new Error('email/password requeridos');
  const cred = await auth.createUserWithEmailAndPassword(email, password);
  if (displayName) await cred.user?.updateProfile({ displayName });
  return cred.user;
}

export async function signInEmail(email: string, password: string) {
  if (!email || !password) throw new Error('email/password requeridos');
  const res = await auth.signInWithEmailAndPassword(email, password);
  return res.user;
}

export function resetPassword(email: string) {
  if (!email) throw new Error('email requerido');
  return auth.sendPasswordResetEmail(email);
}

export function logOut() {
  return auth.signOut();
}

export function listenAuth(cb: (u: firebase.User | null) => void) {
  return auth.onAuthStateChanged(cb);
}

export function useGoogleAuth(onSigned?: (u: firebase.User) => void) {
  const redirectUri = makeRedirectUri({ scheme: 'rutasgastronomicas' });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '1063265187649-mf2ms36jucuv3li9ur4d5867a6ee22vq.apps.googleusercontent.com',
    redirectUri,
  });

  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        const { id_token } = (response.params as any) || {};
        if (!id_token) return;
        const cred = firebase.auth.GoogleAuthProvider.credential(id_token);
        const result = await auth.signInWithCredential(cred);
        if (result.user) onSigned?.(result.user);
      }
    })();
  }, [response]);

  return { request, promptAsync };
}
