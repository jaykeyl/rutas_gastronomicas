import { useEffect, useState } from "react";
import { listenAuth } from "../services/auth";
import { useUserStore } from "../store/useUserStore";
import { ensureUserDoc, fetchUserRole } from "../services/users";

export const useAuthListener = () => {
  const setUser = useUserStore((s) => s.setUser);
  const setLoading = useUserStore((s) => s.setLoading);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const off = listenAuth(async (u) => {
      if (u) {
        const slim = { uid: u.uid, email: u.email, displayName: u.displayName, photoURL: u.photoURL };
        await ensureUserDoc(slim);
        const role = await fetchUserRole(u.uid);
        setUser({ ...slim, role });
        console.log("UID actual =>", u?.uid);

      } else {
        setUser(null);
      }
      setLoading(false);
      setReady(true);
    });
    return off;
  }, [setUser, setLoading]);

  return { ready };
};