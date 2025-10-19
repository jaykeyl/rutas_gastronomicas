import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { spacing, radius } from "../theme/tokens";
import { useReviewsStore, type Review, type ReviewStatus } from "../store/reviews";
import { IS_ADMIN } from "../constants/roles";
import StarRating from "./StarRating";

export default function ReviewsList({ platoId }: { platoId: string }) {
  const { colors } = useThemeColors();
  const styles = getStyles(colors);
  const byDish = useReviewsStore((s) => s.byDish);
  const setStatus = useReviewsStore((s) => s.setReviewStatus);

  const list = byDish[platoId] ?? [];
  const visible = IS_ADMIN ? list : list.filter((r) => r.status === "approved");

  if (!visible.length) {
    return (
      <Text style={{ color: colors.muted, marginTop: spacing.md }}>
        Aún no hay reseñas.
      </Text>
    );
  }

  return (
    <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
      {visible.map((r) => (
        <View
          key={r.id}
          style={[
            styles.card,
            { borderColor: colors.border, backgroundColor: colors.surface, shadowColor: colors.shadow },
          ]}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <StarRating value={r.rating} />
            <StatusBadge status={r.status} />
          </View>
          {r.comment ? (
            <Text style={{ color: colors.text, marginTop: spacing.xs }}>{r.comment}</Text>
          ) : null}

          {IS_ADMIN && (
            <View style={styles.actions}>
              {(["pending","approved","rejected"] as const).map((st) => (
                <TouchableOpacity
                  key={st}
                  onPress={() => setStatus(platoId, r.id, st)}
                  style={[
                    styles.actionChip,
                    { borderColor: colors.border, backgroundColor: colors.surface },
                    r.status === st && { borderColor: colors.text },
                  ]}
                >
                  <Text style={{ color: colors.text, fontWeight: "600" }}>
                    {st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const { colors } = useThemeColors();
  const pill = {
    pending: { txt: "Pending", bd: colors.border },
    approved: { txt: "Approved", bd: colors.text },
    rejected: { txt: "Rejected", bd: colors.border },
  }[status];

  return (
    <View style={{
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: pill.bd,
    }}>
      <Text style={{ color: colors.text, fontWeight: "600" }}>{pill.txt}</Text>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 8,
    gap: spacing.xs,
  },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  actionChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});