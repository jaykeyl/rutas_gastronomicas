import React from 'react';
import { Stack } from 'expo-router';
import {
  StyleSheet,
  Switch,
  Text,
  View,
  TouchableOpacity, 
  Alert,
} from 'react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useThemeStore } from '../../../store/useThemeStore';
import type { ThemeColors } from '../../../theme/tokens';
import { spacing, radius } from '../../../theme/tokens';

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { platos as MOCKS } from '../../../data/platos';

export default function SettingsScreen() {
  const { theme, colors } = useThemeColors();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Configuración' }} />
      <Text style={styles.title}>Apariencia</Text>

      <View style={styles.preferenceRow}>
        <Text style={styles.preferenceLabel}>Modo oscuro</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
          thumbColor={theme === 'dark' ? colors.switchThumb : '#f4f4f5'}
        />
      </View>

      <Text style={styles.helperText}>
        Por defecto se usa el tema del sistema del dispositivo.
      </Text>

      {__DEV__ && (
        <View style={{ marginTop: spacing.lg }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: '700',
              marginBottom: spacing.sm,
              fontSize: 16,
            }}
          >
            Herramientas de desarrollo
          </Text>

          <TouchableOpacity
            onPress={seedPlatosFromMocks}
            style={{
              padding: spacing.md,
              borderRadius: radius.lg,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            accessibilityRole="button"
            accessibilityLabel="Cargar 21 platos a Firestore"
          >
            <Text style={{ color: colors.text, fontWeight: '600' }}>
              Cargar 21 platos a Firestore
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
              Sube los platos del mock a la colección "platos" (sin fotos)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.xl,
      backgroundColor: colors.background,
      gap: spacing.md,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.sm,
    },
    preferenceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      marginBottom: spacing.sm,
    },
    preferenceLabel: {
      fontSize: 18,
      color: colors.text,
      fontWeight: '500',
    },
    helperText: {
      fontSize: 14,
      color: colors.subtitle,
      lineHeight: 20,
    },
  });

async function seedPlatosFromMocks() {
  try {
    for (const p of MOCKS) {
      await setDoc(
        doc(db, 'platos', p.id),
        {
          id: p.id,
          nombre: p.nombre,
          precioReferencial: p.precioReferencial,
          zona: p.zona,
          descripcionCorta: p.descripcionCorta,
          picosidad: p.picosidad,
          status: 'approved',
          createdAt: serverTimestamp(),
          favCount: 0,
        },
        { merge: true }
      );
    }
    Alert.alert('Listo', 'Platos cargados en Firestore ✅');
  } catch (e: any) {
    Alert.alert('Error al cargar', e?.message ?? 'Ocurrió un error desconocido');
  }
}