import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useThemeColors } from "../../hooks/useThemeColors";
import { spacing, radius } from "../../theme/tokens";

export default function Home() {
  const { colors } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.h1, { color: colors.text }]}>SABORES PACEÑOS</Text>
      <Text style={[styles.sub, { color: colors.muted }]}>¡Bienvenido a tu guía de sabores!</Text>

      <Image
        source={{ uri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1" }}
        style={styles.hero}
      />
      <View style={styles.buttons}>
        <Link href="/explorar" asChild>
          <TouchableOpacity style={[styles.btnOutline, { borderColor: colors.primary }]}>
            <Text style={[styles.btnOutlineText, { color: colors.primary }]}>Explorar Platos</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(drawer)/(tabs)/favoritos" asChild>
          <TouchableOpacity style={[styles.btnOutline, { borderColor: colors.primary }]}>
            <Text style={[styles.btnOutlineText, { color: colors.primary }]}>Ver Favoritos</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  { 
    flex: 1, 
    padding: spacing.lg 
  },
  h1: 
  { 
    fontSize: 28, 
    fontWeight: "800", 
    marginBottom: spacing.xs, 
    textAlign: "center" 
  },
  sub: 
  { 
    fontSize: 16, 
    marginBottom: spacing.lg, 
    textAlign: "center" 
  },
  hero: 
  { 
    width: "100%", 
    height: 200, 
    borderRadius: radius.lg, 
    marginBottom: spacing.lg, 
    backgroundColor: "#ddd" 
  },
  buttons: 
  { 
    gap: spacing.md 
  },
  btn: 
  { 
    paddingVertical: spacing.md, 
    borderRadius: radius.lg, 
    alignItems: "center" 
  },
  btnText: 
  { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16 
  },
  btnOutline: 
  { 
    paddingVertical: spacing.md, 
    borderRadius: radius.lg, 
    alignItems: "center", 
    borderWidth: 2 
  },
  btnOutlineText: 
  { 
    fontWeight: "700", 
    fontSize: 16 
  },
});
