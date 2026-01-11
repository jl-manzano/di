import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PersonaConColor } from "../Models/PersonaConColor";

const COLORS = {
  textPrimary: "#1e293b",
  border: "#e2e8f0",
  pickerBorder: "#cbd5e1",
};

function getDeptId(dept: any): number {
  const raw =
    dept?.idDepartamento ??
    dept?.IdDepartamento ??
    dept?.ID ??
    dept?.id ??
    dept?.Id ??
    dept?._idDepartamento ??
    dept?._id;

  const n = typeof raw === "string" ? parseInt(raw, 10) : raw;
  return Number.isFinite(n) ? n : 0;
}

function getDeptNombre(dept: any): string {
  const raw =
    dept?.nombreDepartamento ??
    dept?.NombreDepartamento ??
    dept?.Nombre ??
    dept?.nombre ??
    dept?._nombreDepartamento ??
    dept?._nombre;

  return (raw ?? "").toString();
}

export function PersonaItem({
  personaConColor,
  onSeleccion,
}: {
  personaConColor: PersonaConColor;
  onSeleccion: (personaId: number, departamentoId: number) => void;
}) {
  // 0 = placeholder (no válido)
  const [selectedDepartamento, setSelectedDepartamento] = useState<number>(0);

  const handleSeleccion = (value: any) => {
    const depId = Number(value);

    // Bloquea placeholder o valores inválidos
    if (!Number.isFinite(depId) || depId === 0) return;

    setSelectedDepartamento(depId);
    onSeleccion(personaConColor.persona.id, depId);
  };

  return (
    <View style={[styles.row, { backgroundColor: personaConColor.colorDepartamento }]}>
      <Text style={[styles.cellText, styles.cellNombre]}>{personaConColor.persona.nombre}</Text>
      <Text style={[styles.cellText, styles.cellApellidos]}>{personaConColor.persona.apellidos}</Text>

      <View style={[styles.cellView, styles.cellDepartamento]}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedDepartamento}
            onValueChange={(itemValue) => handleSeleccion(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {/* Placeholder: gris + NO seleccionable */}
            <Picker.Item
              label="Selecciona departamento"
              value={0}
              color="#94a3b8"
              enabled={false}
            />

            {(personaConColor.departamentos as any[]).map((dept: any, idx: number) => {
              const id = getDeptId(dept);
              const nombre = getDeptNombre(dept);

              return (
                <Picker.Item
                  key={id || idx}
                  value={id}
                  label={nombre}
                />
              );
            })}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cellText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  cellNombre: { flex: 2 },
  cellApellidos: { flex: 2 },

  cellView: { justifyContent: "center" },
  cellDepartamento: { flex: 3 },

  pickerWrapper: {
    borderWidth: 2,
    borderColor: COLORS.pickerBorder,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  picker: { height: 44, width: "100%" },
  pickerItem: { fontSize: 14, color: COLORS.textPrimary },
});

export default PersonaItem;
