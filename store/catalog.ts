import { ImageSourcePropType } from "react-native";
import { create } from "zustand";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { ZonaId } from "../data/zonas";

export type Plato = {
  id: string;
  nombre: string;
  precioReferencial: number;
  zona: ZonaId;
  picUri: ImageSourcePropType;
  descripcionCorta: string;
  picosidad: number;
};

type CatalogState = {
  platos: Plato[];
  favoritos: Set<string>;
  favCounts: Record<string, number>; 

  setPlatos: (items: Plato[]) => void;
  toggleFavorito: (id: string) => void;
  isFavorito: (id: string) => boolean;
};

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      platos: [],
      favoritos: new Set<string>(),
      favCounts: {},

      setPlatos: (items) => set({ platos: items }),

      toggleFavorito: (id) => {
        const favoritos = new Set(get().favoritos);
        const wasFav = favoritos.has(id);

        if (wasFav) favoritos.delete(id);
        else favoritos.add(id);

        const favCounts = { ...get().favCounts };
        const prev = favCounts[id] ?? 0;
        favCounts[id] = Math.max(0, prev + (wasFav ? -1 : 1));

        set({ favoritos, favCounts });
      },

      isFavorito: (id) => get().favoritos.has(id),
    }),
    {
      name: "catalog-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoritos: Array.from(state.favoritos),
        favCounts: state.favCounts,
      }),
      onRehydrateStorage: () => (persistedState) => {
        if (persistedState && Array.isArray((persistedState as any).favoritos)) {
          const favArray = (persistedState as any).favoritos as string[];
          useCatalogStore.setState(
            (prev) => ({ ...prev, favoritos: new Set(favArray) } as any),
            false
          );
        }
      },
    }
  )
);
