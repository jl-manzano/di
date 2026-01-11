import { useRef, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { observer } from "mobx-react-lite";
import { container } from "../Core/container";
import { TYPES } from "../Core/types";
import { JuegoVM } from "../UI/ViewModels/JuegoVM";
import { PersonaItem } from "../UI/Components/PersonaItem";

const COLORS = {
  primary: "#667eea",
  primaryDark: "#764ba2",
  background: "#f8fafc",
  cardBackground: "#ffffff",
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textTertiary: "#64748b",
  border: "#e2e8f0",
  hintBackground: "#f8fafc",
  hintBorder: "#64748b",
  successBackground: "#f0f9ff",
  successText: "#075985",
  successBorder: "#bae6fd",
  warningBackground: "#fffbeb",
  warningText: "#92400e",
  warningBorder: "#fde68a",
};

const JuegoScreen = observer(() => {
  const vmRef = useRef<JuegoVM | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [alertY, setAlertY] = useState<number>(0);

  if (vmRef.current === null) {
    vmRef.current = container.get<JuegoVM>(TYPES.JuegoVM);
  }

  const viewModel = vmRef.current;

  useEffect(() => {
    viewModel.cargarPersonas();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Juego de Departamentos</Text>
      <Text style={styles.subtitle}>
        Adivina a qué departamento pertenece cada empleado
      </Text>
    </View>
  );

  const renderHint = () => (
    <View style={styles.hint}>
      <View style={styles.hintHeader}>
        <Text style={styles.hintIcon}>ⓘ</Text>
        <Text style={styles.hintTitle}>Pista</Text>
      </View>
      <Text style={styles.hintText}>
        Los empleados del mismo departamento tienen filas del mismo color. ¡Usa
        esta información para acertar!
      </Text>
    </View>
  );

  const renderAlert = () => {
    if (!viewModel.mensaje) return null;

    const alertStyle =
      viewModel.tipoMensaje === "success"
        ? styles.alertSuccess
        : styles.alertWarning;

    return (
      <View
        onLayout={(e) => setAlertY(e.nativeEvent.layout.y)}
        style={[styles.alert, alertStyle]}
      >
        <Text
          style={
            viewModel.tipoMensaje === "success"
              ? styles.alertSuccessText
              : styles.alertWarningText
          }
        >
          {viewModel.mensaje}
        </Text>
      </View>
    );
  };

  const renderTableHeader = () => (
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

  const handleComprobarYScroll = async () => {
    await viewModel.handleComprobar();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {renderHeader()}
          {renderHint()}
          {renderAlert()}

          {viewModel.isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Cargando datos...</Text>
            </View>
          ) : viewModel.personasConColor.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.emptyText}>No hay personas para mostrar</Text>
            </View>
          ) : (
            <View style={styles.tableWrapper}>
              {renderTableHeader()}
              <FlatList
                key={"personas-" + viewModel.resetKey}
                data={viewModel.personasConColor}
                renderItem={({ item }) => (
                  <PersonaItem
                    personaConColor={item}
                    onSeleccion={viewModel.handleSeleccion}
                  />
                )}
                keyExtractor={(item) => item.persona.id.toString()}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleComprobarYScroll}
              disabled={viewModel.isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>Comprobar Respuestas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 60,
    elevation: 8,
  },

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

  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },

  tableWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
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

  btnContainer: {
    alignItems: "center",
    marginTop: 8,
  },
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
  btnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default JuegoScreen;
