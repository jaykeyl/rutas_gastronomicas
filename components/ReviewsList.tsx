import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { spacing, radius } from "../theme/tokens";
import { useIsAdmin } from "../constants/roles";
import { listReviewsPublic, listReviewsPending, setReviewStatus } from "../services/reviews";
import StarRating from "./StarRating";

type ReviewStatus = "pending" | "approved" | "rejected";

export default function ReviewsList({ platoId }: { platoId: string }) {
  const { colors } = useThemeColors();
  const styles = getStyles(colors);
  const IS_ADMIN = useIsAdmin();

  const [approved, setApproved] = useState<any[]>([]);
  const [pending, setPending]   = useState<any[]>([]);

  const load = async () => {
    const pub = await listReviewsPublic(platoId);
    setApproved(pub);
    if (IS_ADMIN) {
      setPending(await listReviewsPending(platoId));
    } else {
      setPending([]);
    }
  };

  useEffect(() => { load(); }, [platoId, IS_ADMIN]);

  const onAction = async (id: string, status: "approved" | "rejected") => {
    await setReviewStatus(platoId, id, status);
    await load();
  };

  const emptyForUser = !IS_ADMIN && approved.length === 0;

  if (emptyForUser) {
    return (
      <Text style={{ color: colors.muted, marginTop: spacing.md }}>
        Aún no hay reseñas.
      </Text>
    );
  }

  return (
    <View style={{ marginTop: spacing.md, gap: spacing.md }}>
      {IS_ADMIN && pending.length > 0 && (
        <View>
          <Text style={{ color: colors.muted, marginBottom: spacing.xs }}>
            Pendientes ({pending.length})
          </Text>
          {pending.map((r) => (
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

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => onAction(r.id, "approved")}
                  style={[styles.actionChip, { borderColor: colors.border, backgroundColor: colors.surface }]}
                >
                  <Text style={{ color: colors.text, fontWeight: "600" }}>Aprobar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onAction(r.id, "rejected")}
                  style={[styles.actionChip, { borderColor: colors.border, backgroundColor: colors.surface }]}
                >
                  <Text style={{ color: colors.text, fontWeight: "600" }}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View>
        <Text style={{ color: colors.muted, marginBottom: spacing.xs }}>Reseñas</Text>
        {approved.map((r) => (
          <View
            key={r.id}
            style={[
              styles.card,
              { borderColor: colors.border, backgroundColor: colors.surface, shadowColor: colors.shadow },
            ]}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <StarRating value={r.rating} />
              <StatusBadge status={r.status as ReviewStatus} />
            </View>
            {r.comment ? (
              <Text style={{ color: colors.text, marginTop: spacing.xs }}>{r.comment}</Text>
            ) : null}
          </View>
        ))}
      </View>
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
    <View
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: pill.bd,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "600" }}>{pill.txt}</Text>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
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