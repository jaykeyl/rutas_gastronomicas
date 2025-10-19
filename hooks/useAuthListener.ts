import { useEffect, useState } from 'react';
import { listenAuth } from '../services/auth';
import { useUserStore } from '../store/useUserStore';

export function useAuthListener() {
  const setUser = useUserStore(s => s.setUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = listenAuth(u => {
      setUser(u ? {
        uid: u.uid,
        email: u.email || '',
        displayName: u.displayName || '',
        photoURL: u.photoURL || '',
      } : null);
      setReady(true);
    });
    return unsub;
  }, []);

  return { ready };
}
