import { create } from "zustand";

export type Plato = {
  id: string;
  nombre: string;
  precioReferencial: number;
  zona: string;
  picUri: string;
  descripcionCorta: string;
  picosidad: number; // 0–5
};

type CatalogState = {
  platos: Plato[];
  favoritos: Set<string>;
  setPlatos: (items: Plato[]) => void;
  toggleFavorito: (id: string) => void;
  isFavorito: (id: string) => boolean;
};

export const useCatalogStore = create<CatalogState>((set, get) => ({
  platos: [],
  favoritos: new Set(),
  setPlatos: (items) => set({ platos: items }),
  toggleFavorito: (id) => {
    const favs = new Set(get().favoritos);
    favs.has(id) ? favs.delete(id) : favs.add(id);
    set({ favoritos: favs });
  },
  isFavorito: (id) => get().favoritos.has(id),
}));
