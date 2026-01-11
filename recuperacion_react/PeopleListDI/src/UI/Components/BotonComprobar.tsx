import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface BotonComprobarProps {
  onPress: () => void;
  disabled?: boolean;
}

const COLORS = {
  primary: "#667eea",
};

export function BotonComprobar({ onPress, disabled = false }: BotonComprobarProps) {
  return (
    <TouchableOpacity
      style={[styles.btnPrimary, disabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.btnText}>Comprobar Respuestas</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 6,
    minWidth: 200,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
