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
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [names, setNames] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const rows = (await listAllPendingReviews()) as PendingItem[];
    setItems(rows);
    const uniquePlatos = Array.from(new Set(rows.map(r => r.platoId)));
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
    return <View style={{ padding: spacing.lg }}><Text>No autorizado</Text></View>;
  }

  if (loading) {
    return (
      <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <Text style={{ fontWeight: "800", color: colors.text }}>Reseñas pendientes ({items.length})</Text>

      {items.length === 0 ? (
        <Text style={{ color: colors.muted }}>No hay reseñas por revisar.</Text>
      ) : items.map((r) => (
        <View key={r.id} style={[
          styles.card,
          { borderColor: colors.border, backgroundColor: colors.surface, shadowColor: colors.shadow }
        ]}>
          <Text style={{ color: colors.muted, marginBottom: 4 }}>
            {names[r.platoId] ?? "(Plato)"} • {r.platoId}
          </Text>

          <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
            <StarRating value={r.rating} />
            <Badge colors={colors} text="pending" />
          </View>

          {r.comment ? <Text style={{ color: colors.text, marginTop: 6 }}>{r.comment}</Text> : null}
          <Text style={{ color: colors.muted, marginTop: 4 }}>por {r.userDisplayName}</Text>

          <View style={styles.actions}>
            <Chip colors={colors} label="Aprobar" onPress={() => onAction(r.platoId, r.id, "approved")} />
            <Chip colors={colors} label="Rechazar" onPress={() => onAction(r.platoId, r.id, "rejected")} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function Chip({ label, onPress, colors }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "600" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function Badge({ text, colors }: any) {
  return (
    <View style={{ paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ color: colors.text, fontWeight: "600" }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.xs,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 8,
  },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
});