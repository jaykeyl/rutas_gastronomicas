import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export type UserDoc = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  createdAt: any;
};

export async function ensureUserDoc(u: {
  uid: string; email: string | null; displayName: string | null; photoURL: string | null;
}) {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: u.uid,
      email: u.email ?? null,
      displayName: u.displayName ?? null,
      photoURL: u.photoURL ?? null,
      role: "user",
      createdAt: serverTimestamp(),
    } as UserDoc);
  }
}

export async function fetchUserRole(uid: string): Promise<"user"|"admin"> {
  const ref = doc(db, "users", uid);
  const s = await getDoc(ref);
  if (!s.exists()) return "user";
  return (s.data().role as "user"|"admin") ?? "user";
}
