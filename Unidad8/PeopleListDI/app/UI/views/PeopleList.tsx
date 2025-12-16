import React, { useRef } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { container } from "../../Core/container";
import { TYPES } from "../../Core/types";
import { Persona } from "../../Domain/Entities/Persona";
import { PeopleListVM } from "../viewmodels/PeopleListVM";
import { observer } from "mobx-react-lite";

// --- PALETA REAL BETIS ---
const VERDE_BETIS = "#00A650";
const VERDE_CLARO = "#7BC043";
const BLANCO = "#FFFFFF";
const GRIS_CLARO = "#F5F5F5";
const GRIS_MEDIO = "#E0E0E0";
const TEXTO_GRIS = "#666666";

const PeopleList = observer(() => {
  const vmRef = useRef<PeopleListVM | null>(null);
  if (vmRef.current === null) {
    vmRef.current = container.get<PeopleListVM>(TYPES.IndexVM);
  }
  const viewModel = vmRef.current;

  const renderItem = ({ item, index }: { item: Persona; index: number }) => {
    const isSelected = viewModel.personaSeleccionada?.id === item.id;

    return (
      <Pressable
        onPress={() => { viewModel.personaSeleccionada = item; }}
        style={[
          styles.playerCard,
          isSelected && styles.playerCardSelected
        ]}
      >
        {/* Franja verde lateral */}
        <View style={[styles.sideStripe, isSelected && styles.sideStripeActive]} />
        
        <View style={styles.cardContent}>
          {/* Número de dorsal */}
          <View style={[styles.dorsalContainer, isSelected && styles.dorsalActive]}>
            <Text style={[styles.dorsalNumber, isSelected && styles.dorsalNumberActive]}>
              {index + 1}
            </Text>
          </View>

          {/* Avatar circular con inicial */}
          <View style={[styles.avatarCircle, isSelected && styles.avatarCircleActive]}>
            <Text style={[styles.avatarInitial, isSelected && styles.avatarInitialActive]}>
              {item.nombre.charAt(0).toUpperCase()}
            </Text>
          </View>

          {/* Información del jugador */}
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

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header estilo campo de fútbol */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerSubtitle}>REAL BETIS BALOMPIÉ</Text>
            <View style={styles.headerDivider} />
          </View>
          <Text style={styles.headerTitle}>PLANTILLA</Text>
          
          {/* Indicador de selección */}
          {viewModel.personaSeleccionada && (
            <View style={styles.selectedBanner}>
              <View style={styles.selectedIndicator} />
              <Text style={styles.selectedText}>
                {viewModel.personaSeleccionada.nombre} {viewModel.personaSeleccionada.apellidos}
              </Text>
            </View>
          )}
        </View>

        <FlatList
          data={viewModel.personasList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      {/* Líneas decorativas de campo */}
      <View style={styles.fieldLines} pointerEvents="none">
        <View style={styles.fieldLine} />
        <View style={[styles.fieldLine, { top: '50%' }]} />
      </View>
    </View>
  );
});

export default PeopleList;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: BLANCO,
  },
  safeArea: {
    flex: 1,
  },
  
  // --- HEADER ---
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: VERDE_BETIS,
  },
  headerTop: {
    marginBottom: 8,
  },
  headerSubtitle: {
    color: BLANCO,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    opacity: 0.9,
  },
  headerDivider: {
    width: 40,
    height: 3,
    backgroundColor: BLANCO,
    marginTop: 6,
    borderRadius: 2,
  },
  headerTitle: {
    color: BLANCO,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 1,
  },
  
  // --- BANNER DE SELECCIÓN ---
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BLANCO,
    marginRight: 10,
  },
  selectedText: {
    color: BLANCO,
    fontSize: 15,
    fontWeight: "700",
  },

  // --- LISTA ---
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // --- TARJETA DE JUGADOR ---
  playerCard: {
    backgroundColor: BLANCO,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: GRIS_MEDIO,
  },
  playerCardSelected: {
    borderColor: VERDE_BETIS,
    backgroundColor: '#F0FAF4',
    shadowColor: VERDE_BETIS,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // --- FRANJA LATERAL ---
  sideStripe: {
    position: 'absolute',
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

  // --- CONTENIDO ---
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingLeft: 20,
  },

  // --- DORSAL ---
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

  // --- AVATAR ---
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

  // --- INFO JUGADOR ---
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

  // --- BADGE DE ESTADO ---
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: VERDE_BETIS,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
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

  // --- LÍNEAS DECORATIVAS ---
  fieldLines: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  fieldLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: GRIS_MEDIO,
    opacity: 0.3,
    top: '25%',
  },
});