import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "../../../../hooks/useThemeColors";
import { spacing, radius } from "../../../../theme/tokens";
import { TouchableOpacity } from "react-native";
import { logOut } from "../../../../services/auth";
import { useUserStore } from "../../../../store/useUserStore";
import { router } from "expo-router";

export default function PerfilDrawer() {
  const { colors } = useThemeColors();
  const onLogout = async () => { await logOut(); useUserStore.getState().logout(); router.replace("/auth"); };
  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border,
        shadowColor: colors.shadow }]}>
        <View style={styles.avatar} />
        <Text style={[styles.title, { color: colors.text }]}>Configura tu cuentaaaaaaa</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>iiwiweiwiwe</Text>
        <TouchableOpacity onPress={onLogout} style={{ marginTop: 16 }}>
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
  avatar: { width:72, height:72, borderRadius:36, backgroundColor:"#D9D9D9", alignSelf:"center", marginBottom: spacing.lg },
  title: { fontSize:16, fontWeight:"700", textAlign:"center" },
});
