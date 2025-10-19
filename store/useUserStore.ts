import { create } from 'zustand';

export type User = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
} | null;

type UserStore = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));