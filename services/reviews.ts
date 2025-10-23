import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type ReviewDTO = {
  id?: string;
  platoId: string;
  userUid: string;
  userDisplayName: string;
  rating: number;
  comment?: string;
  status: ReviewStatus;
  createdAt?: any;
  user: { uid: string; displayName: string | null };
};

export async function createReview(input: {
  platoId: string;
  userUid: string;
  userDisplayName: string;
  rating: number;
  comment?: string;
}) {
  const ref = collection(db, "platos", input.platoId, "reviews");
  await addDoc(ref, {
    ...input,
    user: { uid: input.userUid, displayName: input.userDisplayName ?? null },
    status: "pending",
    createdAt: serverTimestamp(),
  } as ReviewDTO);
}

export async function listReviewsPublic(platoId: string) {
  const ref = collection(db, "platos", platoId, "reviews");
  const q = query(
    ref,
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function listReviewsPending(platoId: string) {
  const ref = collection(db, "platos", platoId, "reviews");
  const q = query(
    ref,
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function setReviewStatus(
  platoId: string,
  reviewId: string,
  status: "approved" | "rejected"
) {
  const ref = doc(db, "platos", platoId, "reviews", reviewId);
  await updateDoc(ref, { status });
}

export async function listAllPendingReviews() {
  const q = query(
    collectionGroup(db, "reviews"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as any) }))
    .filter((r) => !!r.platoId);
}

const _platoNameCache: Record<string, string> = {};

export async function getPlatoName(platoId: string): Promise<string> {
  if (_platoNameCache[platoId]) return _platoNameCache[platoId];
  const s = await getDoc(doc(db, "platos", platoId));
  const name =
    s.exists() && (s.data() as any)?.nombre
      ? (s.data() as any).nombre
      : "(Plato)";
  _platoNameCache[platoId] = name;
  return name;
}