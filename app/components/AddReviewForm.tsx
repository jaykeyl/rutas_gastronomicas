import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { spacing, radius } from "../theme/tokens";
import { useReviewsStore } from "../store/reviews";

export default function AddReviewForm({ platoId }: { platoId: string }) {
  const { colors } = useThemeColors();
  const styles = getStyles(colors);
  const addReviewLocal = useReviewsStore((s) => s.addReviewLocal);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentMsg, setSentMsg] = useState<null | string>(null);

  const submit = () => {
    if (submitting || !rating) return;
    setSubmitting(true);

    addReviewLocal({
      platoId,
      userDisplayName: "Invitado",
      rating,
      comment: comment.trim() || undefined,
    });

    setRating(5);
    setComment("");

    setSentMsg("Reseña enviada (pendiente de aprobación)");
    setSubmitting(false);

    setTimeout(() => setSentMsg(null), 3000);
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.muted }]}>Añadir reseña</Text>

      <View style={styles.rowWrap}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => setRating(n)}
            style={[
              styles.starChip,
              { borderColor: colors.border, backgroundColor: colors.surface },
              rating === n && { borderColor: colors.text },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Elegir ${n} ${n === 1 ? "estrella" : "estrellas"}`}
          >
            <Text style={[styles.starText, { color: colors.text }]}>{"★".repeat(n)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Escribe tu comentario (opcional)"
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text },
        ]}
        multiline
      />

      <TouchableOpacity
        onPress={submit}
        disabled={submitting}
        style={[
          styles.btn,
          { borderColor: colors.border, backgroundColor: colors.surface, opacity: submitting ? 0.6 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Enviar reseña"
      >
        <Text style={[styles.btnText, { color: colors.text }]}>
          {submitting ? "Enviando..." : "Enviar reseña"}
        </Text>
      </TouchableOpacity>

      {sentMsg ? (
        <Text style={[styles.sent, { color: colors.muted }]}>{sentMsg}</Text>
      ) : null}

      <Text style={{ color: colors.muted, marginTop: spacing.xs, fontSize: 12 }}>
        * La reseña queda como “pending” hasta que un admin la apruebe.
      </Text>
    </View>
  );
}

const getStyles = (colors: ReturnType<typeof useThemeColors>["colors"]) =>
  StyleSheet.create({
    wrap: { marginTop: spacing.md },
    label: { marginBottom: spacing.xs, fontWeight: "700" },

    rowWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    starChip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: radius.lg,
      borderWidth: 1,
    },
    starText: {
      fontSize: 13,
      fontWeight: "700",
      includeFontPadding: false,
      textAlign: "center",
    },

    input: {
      minHeight: 88,
      borderWidth: 1,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      textAlignVertical: "top",
    },
    btn: {
      alignSelf: "flex-start",
      marginTop: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
      borderWidth: 1,
    },
    btnText: { fontWeight: "700" },
    sent: { marginTop: spacing.xs, fontSize: 12, fontStyle: "italic" },
  });
