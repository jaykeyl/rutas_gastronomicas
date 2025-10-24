import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useIsAdmin } from "../../../constants/roles";
import { spacing, radius } from "../../../theme/tokens";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { listAllPendingReviews, getPlatoName, setReviewStatus } from "../../../services/reviews";
import StarRating from "../../../components/StarRating";

type PendingItem = {
  id: string;
  platoId: string;
  userDisplayName: string;
  rating: number;
  comment?: string;
  createdAt?: any;
  status: "pending";
};

export default function ReviewsPendientesScreen() {
  const isAdmin = useIsAdmin();
  const { colors } = useThemeColors();
  const styles = getStyles(colors);

  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [names, setNames] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const rows = (await listAllPendingReviews()) as PendingItem[];
    setItems(rows);
    const uniquePlatos = Array.from(new Set(rows.map((r) => r.platoId)));
    const entries = await Promise.all(uniquePlatos.map(async (pid) => [pid, await getPlatoName(pid)] as const));
    setNames(Object.fromEntries(entries));
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const onAction = async (platoId: string, reviewId: string, status: "approved" | "rejected") => {
    await setReviewStatus(platoId, reviewId, status);
    await load();
  };

  if (!isAdmin) {
    return (
      <View style={styles.notAuth}>
        <Text style={styles.text}>No autorizado</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Reseñas pendientes ({items.length})</Text>

        {items.length === 0 ? (
          <Text style={styles.muted}>No hay reseñas por revisar.</Text>
        ) : (
          items.map((r) => (
            <View key={r.id} style={styles.card}>
              <Text style={styles.muted}>
                {names[r.platoId] ?? "(Plato)"} • {r.platoId}
              </Text>

              <View style={styles.row}>
                <StarRating value={r.rating} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Pendiente</Text>
                </View>
              </View>

              {!!r.comment && <Text style={styles.comment}>{r.comment}</Text>}
              <Text style={styles.muted}>Reseña de {r.userDisplayName}</Text>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.chip} onPress={() => onAction(r.platoId, r.id, "approved")}>
                  <Text style={styles.chipText}>Aprobar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip} onPress={() => onAction(r.platoId, r.id, "rejected")}>
                  <Text style={styles.chipText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ReturnType<typeof useThemeColors>["colors"]) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      backgroundColor: colors.background, 
    },
    content: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    title: {
      fontWeight: "700",
      fontSize: 18,
      color: colors.text,
    },
    text: {
      color: colors.text,
    },
    muted: {
      color: colors.muted,
      marginBottom: 4,
    },
    comment: {
      color: colors.text,
      marginTop: 6,
    },
    card: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.md,
      gap: spacing.xs,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 18,
      elevation: 8,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    badge: {
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    badgeText: {
      color: colors.text,
      fontWeight: "600",
    },
    actions: {
      flexDirection: "row",
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    chip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipText: {
      color: colors.text,
      fontWeight: "600",
    },
    notAuth: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
      justifyContent: "center",
    },
    loader: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
  });