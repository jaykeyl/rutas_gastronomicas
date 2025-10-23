import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Pressable } from "react-native";
import { useState, useLayoutEffect } from "react";
import * as ImagePicker from "expo-image-picker";

import { useThemeColors } from "../../../../hooks/useThemeColors";
import { spacing, radius } from "../../../../theme/tokens";
import { uploadToCloudinary } from "../../../../utils/cloudinary";
import { auth } from "../../../../lib/firebase";
import { useUserStore } from "../../../../store/useUserStore";
import { updateUserProfilePhoto } from "../../../../services/user";

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


export default function PerfilScreen() {
  const { colors } = useThemeColors();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser as any);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions?.({
      title: "Perfil",
      headerRight: () => (
        <Pressable
          onPress={() => Alert.alert("Próximamente", "La configuración de perfil estará disponible pronto.")}
          style={{ paddingRight: 12 }}
        >
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

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={{ width: 96, height: 96, borderRadius: 48 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: "#D9D9D9",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 28 }}>👤</Text>
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
              {
                backgroundColor: colors.primary,
                opacity: loading ? 0.6 : 1,
                marginTop: spacing.md,
              },
            ]}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Cambiar foto</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: spacing.lg },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 8,
  },
  title: { fontSize: 16, fontWeight: "700", textAlign: "center" },
  btn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
