import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { spacing, radius } from "../../theme/tokens";

export default function PerfilDrawer() {
  const { colors } = useThemeColors();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border,
        shadowColor: colors.shadow }]}>
        <View style={styles.avatar} />
        <Text style={[styles.title, { color: colors.text }]}>configura tu cuentaaaaa</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>son diferentes perfiles pipipi</Text>
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
