import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Pressable, ScrollView } from "react-native";
import { useState, useLayoutEffect, useMemo } from "react";
import * as ImagePicker from "expo-image-picker";

import { useThemeColors } from "../hooks/useThemeColors";
import { spacing, radius } from "../theme/tokens";
import { uploadToCloudinary } from "../utils/cloudinary";
import { auth } from "../lib/firebase";
import { useUserStore } from "../store/useUserStore";
import { updateUserProfilePhoto } from "../services/user";

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
    const { colors } = useThemeColors();
    const user = useUserStore((s) => s.user);
    const setUser = useUserStore((s) => s.setUser as any);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const router = useRouter();

    const initials = useMemo(() => {
        if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
        if (user?.email) return user.email.charAt(0).toUpperCase();
        return "?";
    }, [user?.displayName, user?.email]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            Alert.alert("Sesión cerrada", "Vuelve pronto");
            router.replace("/auth");
        } catch (e: any) {
            Alert.alert("Error", e?.message ?? "No se pudo cerrar sesión.");
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions?.({
            title: "Perfil",
            headerRight: () => (
                <Pressable onPress={() => router.push("/(drawer)/settings")} style={{ paddingRight: 12 }}>
                    <Ionicons name="settings-outline" size={22} color={colors.text} />
                </Pressable>
            ),
        });
    }, [navigation, colors.text]);

    const pickAndUpload = async () => {
        try {
            setLoading(true);

            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!perm.granted) {
                Alert.alert("Permisos", "Necesito acceso a tu galería para seleccionar la foto.");
                return;
            }

            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });
            if (res.canceled) return;

            const asset = res.assets?.[0];
            if (!asset?.uri) {
                Alert.alert("Ups", "No se seleccionó ninguna imagen válida.");
                return;
            }

            const up = await uploadToCloudinary(asset.uri, {
                fileName: `profile_${Date.now()}.jpg`,
                mimeType: "image/jpeg",
            });

            const url = up.secure_url || up.url;
            if (!url) {
                Alert.alert("Ups", "No se obtuvo URL de Cloudinary.");
                return;
            }

            const current = auth.currentUser;
            if (!current) {
                Alert.alert("Sesión", "No hay usuario autenticado.");
                return;
            }
            await current.updateProfile({ photoURL: url });
            await current.reload();

            await updateUserProfilePhoto(current.uid, url);

            if (typeof setUser === "function") {
                setUser({
                    uid: current.uid,
                    email: current.email,
                    displayName: current.displayName,
                    photoURL: url,
                });
            }

            Alert.alert("Listo", "Foto actualizada con éxito.");
        } catch (e: any) {
            Alert.alert("Error", e?.message ?? "Error al actualizar foto.");
        } finally {
            setLoading(false);
        }
    };

    const reviewsPlaceholder = [
        { id: "r1", title: "Sajta de pollo — Mi reseña", meta: "⭐️⭐️⭐️⭐️  •  12/09/2025" },
        { id: "r2", title: "Chairo paceño — Comentario", meta: "⭐️⭐️⭐️  •  05/10/2025" },
    ];

    const defaultRoutes = [
        { id: "d1", title: "Ruta clásica La Paz centro", meta: "Plaza Murillo → Mercado Lanza → Sopocachi" },
        { id: "d2", title: "El Alto — 16 de Julio", meta: "Feria → Anticuchos → Api con buñuelo" },
    ];

    const userRoutesPlaceholder = [
        { id: "u1", title: "Mi ruta vegana", meta: "Sopocachi → San Miguel → Calacoto" },
    ];

    const Row = ({ title, meta }: { title: string; meta: string }) => (
        <View style={styles.rowItem}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.rowMeta, { color: colors.muted }]}>{meta}</Text>
        </View>
    );

    return (
        <ScrollView
            style={[styles.wrap, { backgroundColor: colors.background }]}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl * 2 }}
            showsVerticalScrollIndicator={false}
        >
            <View
                style={[
                    styles.card,
                    { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow },
                ]}
            >
                <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
                    {user?.photoURL ? (
                        <Image source={{ uri: user.photoURL }} style={{ width: 96, height: 96, borderRadius: 48 }} resizeMode="cover" />
                    ) : (
                        <View
                            style={{
                                width: 96,
                                height: 96,
                                borderRadius: 48,
                                backgroundColor: colors.primary + "20",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ fontSize: 36, fontWeight: "700", color: colors.primary }}>{initials}</Text>
                        </View>
                    )}

                    <Text style={[styles.title, { color: colors.text, marginTop: spacing.md }]}>
                        {user?.displayName || "Tu perfil"}
                    </Text>
                    <Text style={{ color: colors.muted, marginTop: spacing.xs }}>
                        {user?.email || "Sin email"}
                    </Text>

                    <TouchableOpacity
                        onPress={pickAndUpload}
                        disabled={loading}
                        style={[
                            styles.btn,
                            { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1, marginTop: spacing.md },
                        ]}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Cambiar foto</Text>}
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={[
                    styles.sectionCard,
                    { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow },
                ]}
            >
                <Text style={[styles.sectionTitle, { color: colors.muted }]}>Tus reseñas</Text>
                {reviewsPlaceholder.map((r) => (
                    <Row key={r.id} title={r.title} meta={r.meta} />
                ))}
                <TouchableOpacity style={[styles.linkBtn, { marginTop: spacing.xs }]}>
                    <Text style={[styles.linkText, { color: colors.primary }]}>Ver todas</Text>
                </TouchableOpacity>
            </View>

            <View
                style={[
                    styles.sectionCard,
                    { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow },
                ]}
            >
                <Text style={[styles.sectionTitle, { color: colors.muted }]}>Rutas gastronómicas</Text>

                <Text style={[styles.subTitle, { color: colors.text }]}>Por defecto</Text>
                {defaultRoutes.map((r) => (
                    <Row key={r.id} title={r.title} meta={r.meta} />
                ))}

                <View style={[styles.separator, { backgroundColor: colors.border }]} />

                <Text style={[styles.subTitle, { color: colors.text }]}>Creadas por ti</Text>
                {userRoutesPlaceholder.map((r) => (
                    <Row key={r.id} title={r.title} meta={r.meta} />
                ))}

                <TouchableOpacity
                    onPress={() => router.push("/routes/create")}
                    style={[styles.btnOutline, { borderColor: colors.border, marginTop: spacing.sm, backgroundColor: colors.background }]}
                >
                    <Text style={[styles.btnOutlineText, { color: colors.text }]}>Crear nueva ruta</Text>
                </TouchableOpacity>
            </View>

            <View
                style={[
                    styles.sectionCard,
                    { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow },
                ]}
            >
                <Text style={[styles.sectionTitle, { color: colors.muted }]}>Créditos</Text>

                <View style={styles.kv}>
                    <Text style={[styles.k, { color: colors.muted }]}>App</Text>
                    <Text style={[styles.v, { color: colors.text }]}>Rutas Gastronómicas</Text>
                </View>
                <View style={styles.kv}>
                    <Text style={[styles.k, { color: colors.muted }]}>Versión</Text>
                    <Text style={[styles.v, { color: colors.text }]}>1.0.0</Text>
                </View>

                <View style={[styles.separator, { backgroundColor: colors.border }]} />

                <View style={styles.kv}>
                    <Text style={[styles.k, { color: colors.muted }]}>Desarrollo</Text>
                    <Text style={[styles.v, { color: colors.text }]}>Mel, Patty y Tati</Text>
                </View>
                <View style={styles.kv}>
                    <Text style={[styles.k, { color: colors.muted }]}>Asignatura</Text>
                    <Text style={[styles.v, { color: colors.text }]}>Certificación React Native</Text>
                </View>

                <Text style={[styles.footerNote, { color: colors.muted }]}>
                    Gracias por usar la app. Hecha con ❤ en Bolivia.
                </Text>
            </View>

            <TouchableOpacity
                onPress={handleLogout}
                style={[styles.btnLogout, { borderColor: colors.border, marginTop: spacing.sm, backgroundColor: colors.background }]}
            >
                <Text style={[styles.btnLogoutText, { color: colors.subtitle }]}>Cerrar sesión</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrap: { flex: 1 },
    card: {
        borderRadius: radius.xl,
        borderWidth: 1,
        padding: spacing.xl,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 18,
        elevation: 8,
        marginBottom: spacing.lg,
    },
    title: { fontSize: 16, fontWeight: "700", textAlign: "center" },
    btn: { borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    btnText: { color: "#fff", fontWeight: "700" },

    btnOutline: {
        borderWidth: 1,
        borderRadius: radius.md,
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.lg,
    },
    btnOutlineText: { fontWeight: "700" },

    sectionCard: {
        borderRadius: radius.xl,
        borderWidth: 1,
        padding: spacing.lg,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.6,
        marginBottom: spacing.sm,
    },
    subTitle: { fontSize: 14, fontWeight: "700", marginTop: spacing.xs, marginBottom: spacing.xs },
    rowItem: { marginBottom: spacing.sm },
    rowTitle: { fontSize: 14, fontWeight: "600" },
    rowMeta: { fontSize: 12, marginTop: 2 },
    separator: { height: StyleSheet.hairlineWidth, width: "100%", marginVertical: spacing.sm },
    linkBtn: { alignSelf: "flex-start" },
    linkText: { fontWeight: "700" },

    kv: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs },
    k: { fontSize: 12 },
    v: { fontSize: 12, fontWeight: "600" },

    footerNote: { fontSize: 12, marginTop: spacing.md },

    btnLogout: {
        borderWidth: 1,
        borderRadius: radius.md,
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.lg,
        alignItems: "center",
        justifyContent: "center",
    },
    btnLogoutText: { fontWeight: "700", fontSize: 14 },
});
