import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeColors } from "../hooks/useThemeColors";

export default function RootLayout() {
  const { colors } = useThemeColors();
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text, headerShown: false, }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="explorar" options={{ headerShown: true, title: "Explorar" }} />
      </Stack>
    </>
  );
}
