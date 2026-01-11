import { View, Text, StyleSheet } from "react-native";

const COLORS = {
  textPrimary: "#0f172a",
  textSecondary: "#475569",
};

export function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Juego de Departamentos</Text>
      <Text style={styles.subtitle}>
        Adivina a qué departamento pertenece cada empleado
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});