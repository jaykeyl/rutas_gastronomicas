import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useThemeColors } from "./hooks/useThemeColors";

export default function RootLayout() {
  const { colors } = useThemeColors();
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerStyle:{ backgroundColor: colors.surface }, headerTintColor: colors.text }}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="explorar" options={{ title: "Explorar" }} />
      </Stack>
    </>
  );
}
