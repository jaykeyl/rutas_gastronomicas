import { FlatList, Text, View } from "react-native";
import { useMemo, useState, useEffect } from "react";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { spacing } from "../../../theme/tokens";
import SearchBar from "../../../components/SearchBar";
import ZonaFilter from "../../../components/ZonaFilter";
import DishCard from "../../../components/DishCard";
import { platos as data } from "../../../data/platos";
import { useCatalogStore, type Plato } from "../../../store/catalog";

const ZONAS = ["Todos","Miraflores","Sopocachi","El Alto","San Pedro"] as const;

export default function PlatosList() {
  const { colors } = useThemeColors();
  const [query, setQuery] = useState("");
  const [zona, setZona] = useState<(typeof ZONAS)[number]>("Todos");

  const platos = useCatalogStore(s => s.platos);
  const setPlatos = useCatalogStore(s => s.setPlatos);

  useEffect(() => {
    if (!platos.length) setPlatos(data);
  }, [platos.length, setPlatos]);

  const filtrados = useMemo(
    () =>
      platos
        .filter((p) => p.nombre.toLowerCase().includes(query.toLowerCase()))
        .filter((p) => (zona === "Todos" ? true : p.zona === zona)),
    [platos, query, zona]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.lg }}>
        <SearchBar value={query} onChange={setQuery} />
        <Text style={{ color: colors.muted, marginTop: 4 }}>Zonas</Text>
        <ZonaFilter zonas={[...ZONAS]} value={zona} onChange={setZona} />
      </View>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl }}
        data={filtrados}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => <DishCard item={item} />} 
      />
    </View>
  );
}
