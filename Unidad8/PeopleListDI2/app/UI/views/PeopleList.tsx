import React, { useRef, useEffect } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { observer } from "mobx-react-lite";
import { container } from "../../Core/container";
import { TYPES } from "../../Core/types";
import { PeopleListVM } from "../viewmodels/PeopleListVM";
import { Persona } from "../../Domain/Entities/Persona";

// --- PALETA REAL BETIS ---
const VERDE_BETIS = "#00A650";
const VERDE_CLARO = "#7BC043";
const BLANCO = "#FFFFFF";
const GRIS_CLARO = "#F5F5F5";
const GRIS_MEDIO = "#E0E0E0";
const TEXTO_GRIS = "#666666";

const PeopleList = observer(() => {
  const vmRef = useRef<PeopleListVM | null>(null);

  // Initializing the ViewModel
  if (vmRef.current === null) {
    console.log('🔧 Inicializando ViewModel...');
    vmRef.current = container.get<PeopleListVM>(TYPES.PeopleListVM);
  }

  const viewModel = vmRef.current;

  // Load people when the component mounts
  useEffect(() => {
    console.log('🚀 Componente montado, cargando personas...');
    viewModel.cargarPersonas();
  }, []);

  const renderItem = ({ item, index }: { item: Persona; index: number }) => {
    const isSelected = viewModel.personaSeleccionada?.id === item.id;
    
    console.log(`🔍 Renderizando item ${index}: ${item.nombre} - Seleccionado: ${isSelected}`);

    return (
      <Pressable
        onPress={() => {
          console.log('👆 CLICK en:', item.nombre, item.apellidos);
          Alert.alert('Click', `Seleccionaste: ${item.nombre} ${item.apellidos}`);
          viewModel.personaSeleccionada = item;
          console.log('✅ Después de asignar, personaSeleccionada es:', viewModel.personaSeleccionada?.nombre);
        }}
        style={({ pressed }) => [
          styles.playerCard,
          isSelected && styles.playerCardSelected,
          pressed && { opacity: 0.7 }
        ]}
      >
        <View style={[styles.sideStripe, isSelected && styles.sideStripeActive]} />
        <View style={styles.cardContent}>
          {/* Contact number */}
          <View style={[styles.dorsalContainer, isSelected && styles.dorsalActive]}>
            <Text style={[styles.dorsalNumber, isSelected && styles.dorsalNumberActive]}>
              {index + 1}
            </Text>
          </View>

          {/* Avatar circle with initial */}
          <View style={[styles.avatarCircle, isSelected && styles.avatarCircleActive]}>
            <Text style={[styles.avatarInitial, isSelected && styles.avatarInitialActive]}>
              {item.nombre.charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* Person information */}
          <View style={styles.playerInfo}>
            <Text style={[styles.playerName, isSelected && styles.playerNameActive]}>
              {item.nombre}
            </Text>
            <Text style={[styles.playerSurname, isSelected && styles.playerSurnameActive]}>
              {item.apellidos}
            </Text>
            {isSelected && (
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>ACTIVO</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  console.log('🎨 Renderizando componente. Personas:', viewModel.personasList.length);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personas</Text>
        <Text style={styles.headerSubtitle}>
          {viewModel.personasList.length} contactos
        </Text>
        {viewModel.personaSeleccionada && (
          <Text style={styles.selectedInfo}>
            Seleccionado: {viewModel.personaSeleccionada.nombre} {viewModel.personaSeleccionada.apellidos}
          </Text>
        )}
      </View>

      {viewModel.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={VERDE_BETIS} />
          <Text style={styles.loadingText}>Cargando personas...</Text>
        </View>
      ) : viewModel.personasList.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>No hay personas para mostrar</Text>
        </View>
      ) : (
        <FlatList
          data={viewModel.personasList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          extraData={viewModel.personaSeleccionada}
        />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLANCO,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: VERDE_BETIS,
  },
  headerTitle: {
    color: BLANCO,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: BLANCO,
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.7,
    marginTop: 4,
  },
  selectedInfo: {
    color: BLANCO,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: TEXTO_GRIS,
    fontSize: 14,
  },
  emptyText: {
    color: TEXTO_GRIS,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  playerCard: {
    backgroundColor: BLANCO,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: GRIS_MEDIO,
  },
  playerCardSelected: {
    backgroundColor: "#F0FAF4",
    borderColor: VERDE_BETIS,
    shadowColor: VERDE_BETIS,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  sideStripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: GRIS_MEDIO,
  },
  sideStripeActive: {
    backgroundColor: VERDE_BETIS,
    width: 8,
  },
  dorsalContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: GRIS_CLARO,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: GRIS_MEDIO,
  },
  dorsalActive: {
    backgroundColor: VERDE_BETIS,
    borderColor: VERDE_BETIS,
  },
  dorsalNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: TEXTO_GRIS,
  },
  dorsalNumberActive: {
    color: BLANCO,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GRIS_CLARO,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 3,
    borderColor: GRIS_MEDIO,
  },
  avatarCircleActive: {
    backgroundColor: VERDE_CLARO,
    borderColor: VERDE_BETIS,
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXTO_GRIS,
  },
  avatarInitialActive: {
    color: BLANCO,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  playerNameActive: {
    color: VERDE_BETIS,
  },
  playerSurname: {
    fontSize: 15,
    fontWeight: "500",
    color: TEXTO_GRIS,
  },
  playerSurnameActive: {
    color: "#555",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    backgroundColor: VERDE_BETIS,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BLANCO,
    marginRight: 6,
  },
  statusText: {
    color: BLANCO,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default PeopleList;