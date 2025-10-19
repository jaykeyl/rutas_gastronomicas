// app/components/PicosidadRange.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { spacing, radius } from "../theme/tokens";

type Range = { min: number; max: number };
type Layout = "inline" | "below";

export default function PicosidadRange({
  value,
  onChange,
  layout = "inline", // default: label y botones en la misma fila
}: { value: Range; onChange: (r: Range) => void; layout?: Layout }) {
  const { colors } = useThemeColors();
  const styles = getStyles(colors);

  const bumpMin = (delta: 1 | -1) => {
    const nextMin = Math.min(5, Math.max(0, value.min + delta));
    onChange({ min: nextMin, max: 5 }); // rango x–5
  };

  const Chips = () => (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => bumpMin(-1)}
        style={styles.chip}
        accessibilityRole="button"
        accessibilityLabel="Bajar picosidad mínima"
      >
        <Text style={styles.chipText}>−1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => bumpMin(1)}
        style={styles.chip}
        accessibilityRole="button"
        accessibilityLabel="Subir picosidad mínima"
      >
        <Text style={styles.chipText}>+1</Text>
      </TouchableOpacity>
    </View>
  );

  if (layout === "inline") {
    return (
      <View style={styles.inlineWrap}>
        {/* el wrap del label tiene el mismo padding vertical que los chips para alineación perfecta */}
        <View style={styles.inlineLabelWrap}>
          <Text style={styles.inlineLabelText}>Picosidad: {value.min}–5</Text>
        </View>
        <Chips />
      </View>
    );
  }

  // layout === "below"
  return (
    <View style={styles.blockWrap}>
      <Text style={styles.blockLabel}>Picosidad: {value.min}–5</Text>
      <Chips />
    </View>
  );
}

/* ===================== estilos abajo ===================== */
const getStyles = (colors: ReturnType<typeof useThemeColors>["colors"]) =>
  StyleSheet.create({
    // En línea (misma altura, centrado vertical)
    inlineWrap: {
      marginTop: spacing.xs,
      flexDirection: "row",
      alignItems: "center",           // centra verticalmente label y botones
      justifyContent: "space-between",
      gap: spacing.md,                // más espacio entre label y botones
    },
    inlineLabelWrap: {
      paddingVertical: spacing.sm,    // igual al de los chips para que queden a la misma altura visual
    },
    inlineLabelText: {
      color: colors.muted,
    },

    // Apilado (label arriba, botones abajo)
    blockWrap: {
      marginTop: spacing.xs,
    },
    blockLabel: {
      color: colors.muted,
      marginBottom: spacing.xs,
    },

    // Comunes
    row: {
      flexDirection: "row",
      gap: spacing.md,                // chips más separados
    },
    chip: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm,
      minWidth: 80,                
      alignItems: "center",
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      elevation: 1,
      shadowColor: colors.shadow,
    },
    chipText: {
      fontWeight: "400",
      color: colors.text,
      textAlign: "center",
    },
  });
