import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export type UserDoc = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  createdAt: any;
};

const localPart = (email?: string | null) =>
  (email ? email.split("@")[0] : null) || null;

export async function ensureUserDoc(u: {
  uid: string; email: string | null; displayName: string | null; photoURL: string | null;
}) {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: u.uid,
      email: u.email ?? null,
      displayName: u.displayName ?? localPart(u.email),
      photoURL: u.photoURL ?? null,
      role: "user",
      createdAt: serverTimestamp(),
    } as UserDoc);
  } else {
    const d = snap.data() as Partial<UserDoc>;
    if (!d.displayName) {
      await updateDoc(ref, { displayName: localPart(u.email) });
    }
  }
}

export async function fetchUserDoc(uid: string): Promise<UserDoc | null> {
  const s = await getDoc(doc(db, "users", uid));
  return s.exists() ? (s.data() as UserDoc) : null;
}

export async function updateDisplayName(uid: string, name: string) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { displayName: name });
}

export async function fetchUserRole(uid: string): Promise<"user" | "admin"> {
  const s = await getDoc(doc(db, "users", uid));
  if (!s.exists()) return "user";
  return ((s.data() as any).role as "user" | "admin") ?? "user";
}
