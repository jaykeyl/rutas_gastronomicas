import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useThemeColors } from '../../hooks/useThemeColors';

export default function HomeScreen() {
  const { colors } = useThemeColors();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>SABORES PACEÑOS</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>¡Bienvenido a tu guía de sabores!</Text>

      <Image
        source={{ uri: 'https://picsum.photos/seed/paceno/800/500' }}
        style={[styles.banner, { borderColor: colors.muted }]}
        resizeMode="cover"
      />

      <Pressable
        style={[styles.btnPrimary, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(tabs)/platos')}
      >
        <Text style={styles.btnPrimaryText}>Explorar Platos</Text>
      </Pressable>

      <Pressable
        style={[styles.btnGhost, { borderColor: colors.primary }]}
        onPress={() => router.push('/(tabs)/favoritos')}
      >
        <Text style={[styles.btnGhostText, { color: colors.primary }]}>Ver Favoritos</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: '800', marginTop: 8 },
  subtitle: { fontSize: 14 },
  banner: { width: '100%', height: 200, borderRadius: 12, borderWidth: 1 },
  btnPrimary: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, width: '100%', alignItems: 'center' },
  btnPrimaryText: { color: 'white', fontWeight: '700' },
  btnGhost: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 2, width: '100%', alignItems: 'center' },
  btnGhostText: { fontWeight: '700' },
});
