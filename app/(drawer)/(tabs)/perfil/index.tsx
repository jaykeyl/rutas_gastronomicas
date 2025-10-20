import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { spacing, radius } from '../../../../theme/tokens';
import { useUserStore } from '../../../../store/useUserStore';
import { logOut } from '../../../../services/auth';
import { router } from 'expo-router';

const initials = (name?: string | null, email?: string | null) => {
  const base = name || email || '?';
  const parts = base.split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
};

export default function PerfilTabs() {
  const { colors } = useThemeColors();
  const user = useUserStore((s) => s.user);

  const onLogout = async () => {
    await logOut();
    useUserStore.getState().logout();
    router.replace('/auth');
  };

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: '#D9D9D9', alignItems:'center', justifyContent:'center' }]}>
            <Text style={{ fontWeight:'800', color: colors.text }}>{initials(user?.displayName, user?.email)}</Text>
          </View>
        )}
        <Text style={[styles.title, { color: colors.text }]}>{user?.displayName || 'Usuario'}</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.xs }}>{user?.email || '—'}</Text>

        <TouchableOpacity onPress={onLogout} style={{ marginTop: spacing.lg, alignSelf:'center' }}>
          <Text style={{ color: colors.primary, fontWeight:'700' }}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex:1, padding: spacing.lg },
  card: {
    borderRadius: radius.xl, borderWidth: 1, padding: spacing.xl,
    shadowOffset:{width:0,height:6}, shadowOpacity:1, shadowRadius:18, elevation:8,
  },
  avatar: { width:72, height:72, borderRadius:36, marginBottom: spacing.lg },
  title: { fontSize:16, fontWeight:"700", textAlign:"center" },
});
