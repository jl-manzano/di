import { View, Text, StyleSheet } from "react-native";

const COLORS = {
  hintBackground: "#f8fafc",
  hintBorder: "#64748b",
  textPrimary: "#0f172a",
};

export function Hint() {
  return (
    <View style={styles.hint}>
      <View style={styles.hintHeader}>
        <Text style={styles.hintIcon}>ⓘ</Text>
        <Text style={styles.hintTitle}>Pista</Text>
      </View>
      <Text style={styles.hintText}>
        Los empleados del mismo departamento tienen filas del mismo color.
        ¡Usa esta información para acertar!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    backgroundColor: COLORS.hintBackground,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.hintBorder,
    padding: 16,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  hintHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  hintIcon: {
    fontSize: 16,
    color: COLORS.hintBorder,
    marginRight: 8,
  },
  hintTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  hintText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
});