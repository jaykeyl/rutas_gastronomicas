import { Drawer } from "expo-router/drawer";
import { StyleSheet } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useIsAdmin } from "../../constants/roles";
import { useUserStore } from "../../store/useUserStore";

export default function DrawerLayout() {
  const { colors } = useThemeColors();
  const styles = getStyles(colors);
  const isAdmin = useIsAdmin();
  const loading = useUserStore((s) => s.loading);

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerStyle: styles.drawerStyle,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ title: "Inicio", drawerLabel: "Inicio" }}
      />

      <Drawer.Screen
        name="perfil"
        options={{ title: "Perfil", drawerLabel: "Perfil" }}
      />

      <Drawer.Screen
        name="settings/index"
        options={{
          title: "Ajustes",
          drawerLabel: "Ajustes",
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTintColor: colors.text,
          headerShadowVisible: true,
        }}
      />

      <Drawer.Screen
        name="admin/reviews-pendientes"
        options={{
          title: "Reseñas pendientes",
          drawerLabel: isAdmin ? "Reseñas pendientes" : undefined,
          drawerItemStyle: isAdmin ? undefined : { display: "none" },
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTintColor: colors.text,
          headerShadowVisible: true,
        }}
      />

      <Drawer.Screen
        name="profile/mis-resenas"
        options={{
          title: "Tus reseñas",
          drawerItemStyle: { display: "none" },
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTintColor: colors.text,
          headerShadowVisible: true,
        }}
      />

      <Drawer.Screen
        name="reviews/[platoId]/[reviewId]"
        options={{
          title: "Detalle de reseña",
          drawerItemStyle: { display: "none" },
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTintColor: colors.text,
          headerShadowVisible: true,
        }}
      />
      <Drawer.Screen
        name="admin/historial"
        options={{
          title: "Historial",
          drawerItemStyle: { display: "none" },
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTintColor: colors.text,
          headerShadowVisible: true,
        }}
      />
    </Drawer>
  );
}

const getStyles = (colors: ReturnType<typeof useThemeColors>["colors"]) =>
  StyleSheet.create({
    header: {
      backgroundColor: colors.surface,
    },
    headerTitle: {
      color: colors.text,
      fontWeight: "500",
      fontSize: 20,
    },
    drawerStyle: {
      backgroundColor: colors.background,
    },
  });
