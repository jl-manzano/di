import React, { useRef, useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, SafeAreaView } from "react-native";
import { observer } from "mobx-react-lite";
import { container } from "../../Core/container";
import { TYPES } from "../../Core/types";
import { PeopleListVM } from "../ViewModels/PeopleListVM";
import { Persona } from "../../Domain/Entities/Persona";

// Colores para el tema
const VERDE_BETIS = "#00A650";
const BLANCO = "#FFFFFF";
const GRIS_CLARO = "#F5F5F5";
const GRIS_MEDIO = "#E0E0E0";

const PeopleList = observer(() => {
  const vmRef = useRef<PeopleListVM | null>(null);

  // Inicialización del ViewModel
  if (vmRef.current === null) {
    vmRef.current = container.get<PeopleListVM>(TYPES.PeopleListVM);
  }

  const viewModel = vmRef.current;

  // Cargar personas al montar el componente
  useEffect(() => {
    viewModel.cargarPersonas();
  }, [viewModel]);

  const renderItem = ({ item, index }: { item: Persona; index: number }) => {
    const isSelected = viewModel.personaSeleccionada?.id === item.id;

    return (
      <Pressable
        onPress={() => { viewModel.personaSeleccionada = item; }}
        style={[styles.card, isSelected && styles.cardSelected]} // Mejorada la condición para simplificar el código
      >
        <View style={styles.cardContent}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>
              {item.nombre}
            </Text>
            <Text style={styles.surnameText}>
              {item.apellidos}
            </Text>
          </View>

          {isSelected && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personas</Text>
        <Text style={styles.headerSubtitle}>
          {viewModel.personasList.length} contactos
        </Text>
      </View>

      <FlatList
        data={viewModel.personasList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27", // Fondo oscuro
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 177, 64, 0.1)", // Ligeramente opaco para el borde
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF", // Blanco
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)", // Gris claro para el subtítulo
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#151A3D", // Color oscuro de las tarjetas
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardSelected: {
    backgroundColor: "#1A2F24", // Fondo más oscuro para los elementos seleccionados
    borderColor: "#00B140", // Verde para la selección
    shadowColor: "#00B140", // Sombra verde
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  numberText: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)", // Gris claro
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  nameText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF", // Blanco
    letterSpacing: 0.3,
  },
  surnameText: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.5)", // Gris claro para apellidos
    letterSpacing: 0.2,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00B140", // Verde para la selección
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00B140", // Sombra verde para el checkmark
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // Blanco para el checkmark
  },
});

export default PeopleList;