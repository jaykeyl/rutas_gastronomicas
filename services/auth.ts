import { auth, getAuthInstance } from '../lib/firebase';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { GoogleAuthProvider, signInWithCredential, type User } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

export async function signUpEmail(email: string, password: string, displayName?: string) {
  if (!email || !password) throw new Error('email/password requeridos');
  const cred = await auth.createUserWithEmailAndPassword(email, password);
  if (displayName && cred.user) await cred.user.updateProfile({ displayName });
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

export function listenAuth(cb: (u: any | null) => void) {
  return auth.onAuthStateChanged(cb);
}

export function useGoogleAuth(onSigned?: (u: User) => void) {
  const owner = (Constants.expoConfig?.owner ?? 'mel_2025s').toLowerCase();
  const slug  = Constants.expoConfig?.slug  ?? 'rutas_gastronomicas';

  const redirectUri = `https://auth.expo.io/@${owner}/${slug}`;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '970592502851-98j3193ql53plkcapc54l4p78pv30n7r.apps.googleusercontent.com',
    redirectUri,
  });

  const handled = useRef(false);

  useEffect(() => {
    console.log('EXPERIENCE -> @' + owner + '/' + slug);
    console.log('REDIRECT URI USADO POR LA APP ->', redirectUri);
  }, [redirectUri]);

  useEffect(() => {
    (async () => {
      if (handled.current || !response) return;

      if (response.type === 'success') {
        handled.current = true;
        const { id_token } = response.params as any;
        const cred = GoogleAuthProvider.credential(id_token);
        const { user } = await signInWithCredential(getAuthInstance(), cred);
        onSigned?.(user);
      } else if (response.type === 'error') {
        console.log('Google error:', response.error);
      }
    })();
  }, [response, onSigned]);

  const signIn = () =>
    // @ts-expect-error
    promptAsync({ useProxy: true, showInRecents: true });

  return { request, promptAsync: signIn };
}
