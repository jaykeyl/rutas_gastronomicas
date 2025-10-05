import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, View } from "react-native";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { spacing, radius } from "../../../theme/tokens";
import data from "../../../data/platos.json";
import type { Dish } from "../../../components/DishCard";

export default function PlatoDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemeColors();
  const plato = (data as Dish[]).find(p => p.id === id);

  if (!plato) return <View style={{ padding: spacing.lg }}><Text>No encontrado</Text></View>;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg }}>
      <Image source={{ uri: plato.picUri }} style={{ height: 220, borderRadius: radius.lg, marginBottom: spacing.md }} />
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth:1,
        borderRadius: radius.lg, padding: spacing.lg,
        shadowColor: colors.shadow, shadowOffset:{width:0,height:6}, shadowOpacity:1, shadowRadius:18, elevation:8 }}>
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text }}>{plato.nombre}</Text>
          <Ionicons name="heart-outline" size={20} color={colors.muted} />
        </View>
        <Text style={{ color: colors.text, fontWeight: "700", marginTop: 4 }}>${plato.precioReferencial.toFixed(2)}</Text>
        <Text style={{ color: colors.muted, marginBottom: spacing.md }}>🌶️ Picosidad: {plato.picosidad <=1 ? "Baja" : plato.picosidad<=3 ? "Media" : "Alta"}</Text>
        <Text style={{ color: colors.text }}>{plato.descripcionCorta}</Text>
      </View>
    </ScrollView>
  );
}
