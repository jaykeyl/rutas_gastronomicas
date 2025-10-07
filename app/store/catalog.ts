import { ImageSourcePropType } from "react-native";
import { create } from "zustand";

export type Plato = {
  id: string;
  nombre: string;
  precioReferencial: number;
  zona: string;
  picUri: ImageSourcePropType;
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
  favoritos: new Set<string>(),

  setPlatos: (items) => set({ platos: items }),

  toggleFavorito: (id) =>
    set((state) => {
      const next = new Set(state.favoritos);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { favoritos: next };
    }),

  isFavorito: (id) => get().favoritos.has(id),
}));
