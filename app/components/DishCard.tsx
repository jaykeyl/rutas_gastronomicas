import { Image, Text, View, TouchableOpacity, Pressable, StyleSheet, ImageSourcePropType } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../hooks/useThemeColors";
import { useCurrency } from "../hooks/useCurrency";
import { spacing, radius } from "../theme/tokens";
import { useCatalogStore, type Plato } from "../store/catalog";
import { formatPicosidad } from "../utils/picosidad";

export type Dish = Plato;

export default function DishCard({ item }: { item: Dish }) {
  const { colors } = useThemeColors();
  const { format } = useCurrency();
  const fav = useCatalogStore((s) => s.favoritos.has(item.id));
  const toggleFavorito = useCatalogStore((s) => s.toggleFavorito);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow },
      ]}
    >
      <Link href={`/(drawer)/(tabs)/platos/${item.id}`} asChild>
        <Pressable style={{ flexDirection: "row", gap: spacing.md, flex: 1 }}>
          <Image source={item.picUri} style={styles.img} resizeMode="cover" />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {item.nombre}
            </Text>
            <Text style={{ color: colors.muted }}>
              {formatPicosidad(item.picosidad)}
            </Text>

          </View>
        </Pressable>
      </Link>

      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <Text style={[styles.price, { color: colors.text }]}>{format(item.precioReferencial)}</Text>
        <TouchableOpacity
          onPress={() => toggleFavorito(item.id)}
          hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
          accessibilityRole="button"
          accessibilityLabel={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={18}
            color={fav ? "#e11d48" : colors.muted}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 8,
  },
  img: { width: 72, height: 56, borderRadius: radius.md, backgroundColor: "#ddd" },
  title: { fontSize: 16, fontWeight: "700" },
  price: { fontSize: 14, fontWeight: "700" },
});
