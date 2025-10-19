import { FlatList, Text, View } from "react-native";
import { useMemo, useState, useEffect } from "react";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { spacing } from "../../../theme/tokens";
import SearchBar from "../../../components/SearchBar";
import ZonaFilter from "../../../components/ZonaFilter";
import DishCard from "../../../components/DishCard";
import { platos as data } from "../../../data/platos";
import { useCatalogStore, type Plato } from "../../../store/catalog";
import PicosidadRange from "../../../components/PicosidadRange";

const ZONAS = ["Todos","Miraflores","Sopocachi","El Alto","San Pedro"] as const;

export default function PlatosList() {
  const { colors } = useThemeColors();
  const [query, setQuery] = useState("");
  const [zona, setZona] = useState<(typeof ZONAS)[number]>("Todos");
  const [picRange, setPicRange] = useState({ min: 0, max: 5 });

  const platos = useCatalogStore(s => s.platos);
  const setPlatos = useCatalogStore(s => s.setPlatos);

  useEffect(() => {
    if (!platos.length) setPlatos(data);
  }, [platos.length, setPlatos]);

  const filtrados = useMemo(
    () =>
      platos
        .filter((p) => p.nombre.toLowerCase().includes(query.toLowerCase()))
        .filter((p) => (zona === "Todos" ? true : p.zona === zona))
        .filter((p) => p.picosidad >= picRange.min && p.picosidad <= picRange.max),
    [platos, query, zona, picRange]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.lg }}>
        <SearchBar value={query} onChange={setQuery} />
        <Text style={{ color: colors.muted, marginTop: 4 }}>Zonas</Text>
        <ZonaFilter zonas={[...ZONAS]} value={zona} onChange={setZona} />
        <PicosidadRange value={picRange} onChange={setPicRange} />
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
