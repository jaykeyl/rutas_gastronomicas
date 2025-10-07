import { router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../hooks/useThemeColors";
import { spacing, radius } from "../theme/tokens";

export default function AuthScreen() {
    const { colors } = useThemeColors();

    const goIn = () => {
        router.replace("/(drawer)/(tabs)");
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.logoWrap}>
                <View style={[styles.logoCard, { backgroundColor: colors.surface, shadowColor: colors.text }]}>
                    <Text style={[styles.emoji, { color: colors.primary }]}>🍽️</Text>
                </View>
                <Text style={[styles.title, { color: colors.text }]}>Rutas Gastronómicas</Text>
                <Text style={[styles.subtitle, { color: colors.subtitle }]}>
                    Explora platos de La Paz.
                </Text>
            </View>

            <View style={styles.ctaWrap}>
                <TouchableOpacity
                    onPress={goIn}
                    activeOpacity={0.9}
                    style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.text }]}
                >
                    <Ionicons name="log-in-outline" size={22} color="#fff" />
                    <Text style={styles.buttonText}>Entra a la aplicación </Text>
                </TouchableOpacity>

                <Text style={[styles.disclaimer, { color: colors.muted }]}>
                    No credentials por ahora, solo es una prueba.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl * 2,
        paddingBottom: spacing.xl,
        justifyContent: "space-between",
    },
    logoWrap: {
        alignItems: "center",
        gap: spacing.md,
        marginTop: spacing.xl,
    },
    logoCard: {
        width: 120,
        height: 120,
        borderRadius: radius.xl,
        alignItems: "center",
        justifyContent: "center",
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
    },
    emoji: {
        fontSize: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        textAlign: "center",
        maxWidth: 320,
        lineHeight: 20,
    },
    ctaWrap: {
        gap: spacing.md,
    },
    button: {
        height: 56,
        borderRadius: radius.lg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.4,
    },
    disclaimer: {
        fontSize: 12,
        textAlign: "center",
    },
});
