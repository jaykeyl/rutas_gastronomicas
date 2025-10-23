import { Drawer } from "expo-router/drawer";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useIsAdmin } from "../../constants/roles";
import { useUserStore } from "../../store/useUserStore";

export default function DrawerLayout() {
  const { colors } = useThemeColors();
  const isAdmin = useIsAdmin();
  const loading = useUserStore((s) => s.loading);

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Inicio", drawerLabel: "Inicio" }} />
      <Drawer.Screen name="perfil" options={{ title: "Perfil", drawerLabel: "Perfil" }} />
      <Drawer.Screen name="settings/index" options={{ title: "Ajustes", drawerLabel: "Ajustes" }} />

      {!loading && isAdmin && (
        <Drawer.Screen
          name="admin/reviews-pendientes"
          options={{ title: "Reseñas pendientes", drawerLabel: "Reseñas pendientes" }}
        />
      )}
    </Drawer>
  );
}
