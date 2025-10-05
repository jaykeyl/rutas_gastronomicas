import { View, Text, StyleSheet, FlatList } from "react-native";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { spacing, radius } from "../../../theme/tokens";
import { useCatalogStore } from "../../../store/catalog";
import DishCard from "../../../components/DishCard";

export default function FavoritosTab() {
  const { colors } = useThemeColors();
  const platos = useCatalogStore((s) => s.platos);
  const favoritos = useCatalogStore((s) => s.favoritos);

  const favoritosList = platos.filter((p) => favoritos.has(p.id));

  if (!favoritosList.length) {
    return (
      <View style={[styles.wrap, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow },
          ]}
        >
          <Text style={{ fontSize: 48, textAlign: "center", marginBottom: spacing.md, color: colors.primary }}>♥</Text>
          <Text style={[styles.msg, { color: colors.text }]}>¡Aquí verás tus platos favoritos!</Text>
          <Text style={{ textAlign: "center", color: colors.muted, marginTop: 6 }}>
            Toca el corazón en un plato para guardarlo.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg }}>
      <FlatList
        contentContainerStyle={{ paddingVertical: spacing.lg }}
        data={favoritosList}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => <DishCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: spacing.lg },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 8,
  },
  msg: { textAlign: "center", fontWeight: "700" },
});
