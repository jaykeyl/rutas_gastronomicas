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
    disabled = false,
}: {
    zonaSel: ZonaId | "all";
    onZona: (z: ZonaId | "all") => void;
    picoSel: PicoBand;
    onPico: (p: PicoBand) => void;
    disabled?: boolean;
}) {
    const { colors } = useThemeColors();

    return (
        <View>
            <Text style={[styles.title, { color: colors.text }]}>Filtros</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Chip
                    text="Todas las zonas"
                    active={zonaSel === "all"}
                    onPress={() => onZona("all")}
                    disabled={disabled}
                />
                {zonas.map((z) => (
                    <Chip
                        key={z.id}
                        text={z.nombre}
                        active={zonaSel === z.id}
                        onPress={() => onZona(z.id)}
                        disabled={disabled}
                    />
                ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                <Chip
                    text="Picosidad: Todas"
                    active={picoSel === "all"}
                    onPress={() => onPico("all")}
                    disabled={disabled}
                />
                <Chip
                    text="Suave (1–2)"
                    active={picoSel === "suave"}
                    onPress={() => onPico("suave")}
                    disabled={disabled}
                />
                <Chip
                    text="Media (3)"
                    active={picoSel === "medio"}
                    onPress={() => onPico("medio")}
                    disabled={disabled}
                />
                <Chip
                    text="Picante (4–5)"
                    active={picoSel === "picante"}
                    onPress={() => onPico("picante")}
                    disabled={disabled}
                />
            </ScrollView>
        </View>
    );
}

function Chip({
    text,
    active,
    onPress,
    disabled,
}: {
    text: string;
    active: boolean;
    onPress: () => void;
    disabled?: boolean;
}) {
    const { colors } = useThemeColors();
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.chip,
                {
                    backgroundColor: active ? colors.primary : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                    opacity: disabled ? 0.5 : 1,
                },
            ]}
        >
            <Text
                style={{
                    color: active ? "#fff" : colors.subtitle,
                    fontWeight: "700",
                }}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 14, fontWeight: "800", marginBottom: 6 },
    chip: {
        paddingHorizontal: 16,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        borderWidth: 1,
    },
});
