import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../hooks/useThemeColors";
import { spacing, radius } from "../theme/tokens";

export type Dish = {
  id: string; nombre: string; precioReferencial: number;
  zona: string; picUri: string; descripcionCorta: string; picosidad: number;
};

export default function DishCard({ item }: { item: Dish }) {
  const { colors } = useThemeColors();
  return (
    <Link href={`/(drawer)/(tabs)/platos/${item.id}`} asChild>
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow },
        ]}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.picUri }} style={styles.img} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.nombre}</Text>
          <Text style={{ color: colors.muted }}>🌶️ Picosidad: {["Baja","Media","Alta"][Math.min(2, Math.max(0, Math.round(item.picosidad/2)))]}</Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <Text style={[styles.price, { color: colors.text }]}>${item.precioReferencial.toFixed(2)}</Text>
          <Ionicons name="heart-outline" size={18} color={colors.muted} />
        </View>
      </TouchableOpacity>
    </Link>
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
  img: 
  { 
    width: 56, 
    height: 56, 
    borderRadius: radius.md, 
    backgroundColor: "#ddd" 
  },
  title: 
  { 
    fontSize: 16, 
    fontWeight: "700" 
  },
  price: { 
    fontSize: 14, 
    fontWeight: "700" 
  },
});
