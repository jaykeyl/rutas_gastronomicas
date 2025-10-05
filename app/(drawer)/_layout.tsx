import { Drawer } from "expo-router/drawer";
import { useThemeColors } from "../hooks/useThemeColors";

export default function DrawerLayout() {
  const { colors } = useThemeColors();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ title: "Inicio", drawerLabel: "Inicio" }}
      />
      <Drawer.Screen
        name="perfil/index"         
        options={{ title: "Perfil", drawerLabel: "Perfil" }}
      />
    </Drawer>
  );
}
