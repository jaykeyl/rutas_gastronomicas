import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { zonas, type ZonaId } from "../data/zonas";


export type PicoBand = "all" | "suave" | "medio" | "picante"; 


export default function MapFilters({
zonaSel,
onZona,
picoSel,
onPico,
}: {
zonaSel: ZonaId | "all";
onZona: (z: ZonaId | "all") => void;
picoSel: PicoBand;
onPico: (p: PicoBand) => void;
}) {
const { colors } = useThemeColors();


return (
<View style={[styles.wrap, { backgroundColor: colors.background }]}>
<Text style={[styles.title, { color: colors.text }]}>Filtros</Text>
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
<Chip text="Todas las zonas" active={zonaSel === "all"} onPress={() => onZona("all")} />
{zonas.map((z) => (
<Chip key={z.id} text={z.nombre} active={zonaSel === z.id} onPress={() => onZona(z.id)} />
))}
</ScrollView>
<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
<Chip text="Picosidad: Todas" active={picoSel === "all"} onPress={() => onPico("all")} />
<Chip text="Suave (1–2)" active={picoSel === "suave"} onPress={() => onPico("suave")} />
<Chip text="Media (3)" active={picoSel === "medio"} onPress={() => onPico("medio")} />
<Chip text="Picante (4–5)" active={picoSel === "picante"} onPress={() => onPico("picante")} />
</ScrollView>
</View>
);
}


function Chip({ text, active, onPress }: { text: string; active: boolean; onPress: () => void }) {
const { colors } = useThemeColors();
return (
<TouchableOpacity
onPress={onPress}
style={[styles.chip, { backgroundColor: active ? colors.primary : colors.primary }]}
>
<Text style={{ color: active ? "#fff" : colors.text, fontWeight: "600" }}>{text}</Text>
</TouchableOpacity>
);
}


const styles = StyleSheet.create({
wrap: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 },
title: { fontSize: 14, fontWeight: "700", marginBottom: 6 },
chip: {
paddingHorizontal: 12,
height: 34,
borderRadius: 17,
alignItems: "center",
justifyContent: "center",
marginRight: 8,
},
});