import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { spacing, radius } from "../../../theme/tokens";

export default function FavoritosTab(){
  const { colors } = useThemeColors();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
        <Text style={{ fontSize:48, textAlign:"center", marginBottom: spacing.md, color: colors.primary }}>♥</Text>
        <Text style={[styles.msg, { color: colors.text }]}>¡Aquí verás tus platos favoritos!</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:{ flex:1, padding: spacing.lg },
  card:{
    borderRadius: radius.xl, borderWidth:1, padding: spacing.xl,
    shadowOffset:{width:0,height:6}, shadowOpacity:1, shadowRadius:18, elevation:8,
  },
  msg:{ textAlign:"center", fontWeight:"700" },
});
