import React, { useRef } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, ImageBackground, Dimensions, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { container } from "../../Core/container";
import { TYPES } from "../../Core/types";
import { Persona } from "../../Domain/Entities/Persona";
import { PeopleListVM } from "../viewmodels/PeopleListVM";
import { observer } from "mobx-react-lite";

// --- PALETA DE COLORES REAL BETIS ---
const VERDE_BETIS = "#00B140";  // Verde Betis
const BLANCO = "#FFFFFF";  // Blanco
const NEGRO = "#000000";  // Para contrastes
const GRIS_OSCURO = "#1B1B1B";  // Fondo oscuro suave para darle profundidad
const DORADO = "#FFD700"; // Detalles dorados para resaltar

// Fondo de las tarjetas
const CARD_BG = "rgba(10, 20, 40, 0.8)"; // Fondo oscuro con opacidad para dar un estilo deportivo

// Obtener el ancho de la pantalla
const screenWidth = Dimensions.get("window").width;

const PeopleList = observer(() => {
  const vmRef = useRef<PeopleListVM | null>(null);
  if (vmRef.current === null) {
    vmRef.current = container.get<PeopleListVM>(TYPES.IndexVM);
  }
  const viewModel = vmRef.current;

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const renderItem = ({ item, index }: { item: Persona; index: number }) => {
    const isSelected = viewModel.personaSeleccionada?.id === item.id;
    const mainColor = isSelected ? VERDE_BETIS : BLANCO;

    return (
      <Pressable
        onPress={() => { viewModel.personaSeleccionada = item; }}
        style={[
          styles.techCard,
          { borderColor: mainColor, shadowColor: mainColor },
          isSelected && styles.techCardSelected
        ]}
      >
        {/* Decoración de esquinas */}
        <TechCorners color={mainColor} />

        <View style={styles.cardInner}>
          {/* Índice estilo terminal */}
          <Text style={[styles.indexText, { color: mainColor }]}>
            {String(index + 1).padStart(2, '0')} //
          </Text>

          <CyberAvatar nombre={item.nombre} active={isSelected} />

          <View style={styles.infoContainer}>
            <Text style={[styles.techName, isSelected && { color: VERDE_BETIS, textShadowColor: VERDE_BETIS, textShadowRadius: 10 }]}>
              {item.nombre.toUpperCase()}
            </Text>
            <Text style={styles.techSurname}>
              {item.apellidos.toUpperCase()}
            </Text>
            <Text style={[styles.dataText, { color: mainColor }]}>
              STATUS: {isSelected ? "ACTIVO_BETIS CONECTADO" : "ONLINE_En espera"}
            </Text>
          </View>
        </View>

        {/* Efecto de "Grid" de fondo en la tarjeta */}
        <View style={styles.gridOverlay} />
      </Pressable>
    );
  };

  return (
    <View style={styles.mainBackground}>
      <SafeAreaView style={styles.container}>
        {/* HEADER TIPO FÚTBOL */}
        <View style={styles.terminalHeader}>
          <Text style={styles.terminalSubtitle}>// ESTADO_ACTIVO // UNIDAD_JUGADORES</Text>
          <Text style={styles.terminalTitle}>BASE DE JUGADORES</Text>
          <View style={styles.headerSeparator} />
        </View>

        {/* Feedback de selección Holográfico */}
        {viewModel.personaSeleccionada && (
          <View style={styles.holoBanner}>
            <Text style={styles.holoText}>
              <Text style={{ color: VERDE_BETIS }}>ACTIVADO: </Text>
              {viewModel.personaSeleccionada.nombre} {viewModel.personaSeleccionada.apellidos}
            </Text>
          </View>
        )}

        <FlatList
          data={viewModel.personasList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      {/* Efecto de "Scanlines" global (líneas horizontales finas) */}
      <View style={styles.scanlineOverlay} pointerEvents="none" />
    </View>
  );
});

export default PeopleList;

// --- COMPONENTES DECORATIVOS "DEPORTIVOS" ---

// Esquinas brillantes para dar efecto de "HUD"
const TechCorners = ({ color }: { color: string }) => (
  <>
    <View style={[styles.corner, styles.cornerTL, { borderColor: color }]} />
    <View style={[styles.corner, styles.cornerTR, { borderColor: color }]} />
    <View style={[styles.corner, styles.cornerBL, { borderColor: color }]} />
    <View style={[styles.corner, styles.cornerBR, { borderColor: color }]} />
  </>
);

// Avatar Deportivo
const CyberAvatar = ({ nombre, active }: { nombre: string; active: boolean }) => {
  const initial = nombre.charAt(0).toUpperCase();
  const glowColor = active ? VERDE_BETIS : BLANCO;
  return (
    <View style={[styles.avatarContainer, { borderColor: glowColor, shadowColor: glowColor }]}>
      <Text style={[styles.avatarText, { color: glowColor }]}>{initial}</Text>
      {/* Línea de escaneo falsa */}
      <View style={[styles.scanLine, { backgroundColor: glowColor }]} />
    </View>
  );
};

// --- ESTILOS TIPO FÚTBOL Y REAL BETIS ---
const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: GRIS_OSCURO,
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 50,
  },

  // --- HEADER ---
  terminalHeader: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  terminalSubtitle: {
    color: VERDE_BETIS,
    fontFamily: "Courier",
    fontSize: 12,
    letterSpacing: 2,
    opacity: 0.8,
    marginBottom: 5,
  },
  terminalTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 3,
    textShadowColor: VERDE_BETIS,
    textShadowRadius: 15,
    fontStyle: "italic",
  },
  headerSeparator: {
    height: 2,
    backgroundColor: VERDE_BETIS,
    width: 100,
    marginTop: 10,
    shadowColor: VERDE_BETIS,
    shadowRadius: 10,
    shadowOpacity: 1,
  },

  // --- HOLO BANNER ---
  holoBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 255, 0, 0.1)', // Verde holográfico
    borderWidth: 1,
    borderColor: VERDE_BETIS,
    borderStyle: 'dashed',
  },
  holoText: {
    color: "white",
    fontFamily: "Courier",
    fontSize: 14,
  },

  // --- TECH CARD (EL ÍTEM) ---
  techCard: {
    backgroundColor: CARD_BG,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  techCardSelected: {
    backgroundColor: "rgba(0, 255, 0, 0.15)", // Tinte verde al seleccionar
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    zIndex: 2,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    zIndex: 1,
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "dotted",
    transform: [{ scale: 2 }],
  },

  // --- ESQUINAS FUTBOL --
  corner: {
    position: "absolute",
    width: 15,
    height: 15,
    borderColor: VERDE_BETIS,
    zIndex: 3,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },

  // --- CONTENIDO ---
  indexText: {
    fontFamily: "Courier",
    fontSize: 14,
    marginRight: 15,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
  },
  techName: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
  techSurname: {
    color: "#rgba(255,255,255,0.7)",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
  },
  dataText: {
    fontFamily: "Courier",
    fontSize: 10,
  },

  // --- CYBER AVATAR ---
  avatarContainer: {
    width: 60,
    height: 60,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    overflow: "hidden",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  scanLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    top: "50%",
    opacity: 0.5,
  },

  // --- OVERLAY GLOBAL ---
  scanlineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    borderTopWidth: 1,
    borderColor: "rgba(0, 255, 249, 0.05)",
    zIndex: 999,
  },
});
