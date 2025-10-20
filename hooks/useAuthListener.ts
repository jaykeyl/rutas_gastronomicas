import { useEffect, useState } from "react";
import { listenAuth } from "../services/auth";
import { useUserStore } from "../store/useUserStore";

export const useAuthListener = () => {
  const setUser = useUserStore((s) => s.setUser);
  const setLoading = useUserStore((s) => s.setLoading);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const off = listenAuth((u) => {
      setUser(u ? { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL } : null);
      setLoading(false);
      setReady(true);
    });
    return off;
  }, [setUser, setLoading]);

  return { ready };
};
