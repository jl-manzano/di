import { View, Text, StyleSheet } from "react-native";

const COLORS = {
  textPrimary: "#0f172a",
};

export function TableHeader() {
  return (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderText, styles.columnNombre]}>Nombre</Text>
      <Text style={[styles.tableHeaderText, styles.columnApellidos]}>
        Apellidos
      </Text>
      <Text style={[styles.tableHeaderText, styles.columnDepartamento]}>
        Departamento
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    backgroundColor: COLORS.textPrimary,
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  columnNombre: {
    flex: 2,
  },
  columnApellidos: {
    flex: 2,
  },
  columnDepartamento: {
    flex: 3,
  },
});