import React from 'react';
import { Stack } from 'expo-router';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function PlatosLayout() {
  const { colors } = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Platos Paceños' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalles del plato' }} />
    </Stack>
  );
}
