import { View, Text, StyleSheet } from "react-native";

interface MensajeResultadoProps {
  mensaje: string;
  tipo: "success" | "warning" | "";
}

const COLORS = {
  successBackground: "#f0f9ff",
  successText: "#075985",
  successBorder: "#bae6fd",
  warningBackground: "#fffbeb",
  warningText: "#92400e",
  warningBorder: "#fde68a",
};

export function MensajeResultado({ mensaje, tipo }: MensajeResultadoProps) {
  if (!mensaje) return null;

  const alertStyle = tipo === "success" ? styles.alertSuccess : styles.alertWarning;
  const textStyle = tipo === "success" ? styles.alertSuccessText : styles.alertWarningText;

  return (
    <View style={[styles.alert, alertStyle]}>
      <Text style={textStyle}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  alertSuccess: {
    backgroundColor: COLORS.successBackground,
    borderColor: COLORS.successBorder,
  },
  alertWarning: {
    backgroundColor: COLORS.warningBackground,
    borderColor: COLORS.warningBorder,
  },
  alertSuccessText: {
    color: COLORS.successText,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  alertWarningText: {
    color: COLORS.warningText,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});