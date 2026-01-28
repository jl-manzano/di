/**
 * APP.TSX - Entrada de la aplicación
 * Inicializa el contenedor IoC y renderiza la pantalla principal
 */

import 'reflect-metadata';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Contenedor IoC
import { container, setupDependencies } from '../core/container';
import { TYPES } from '../core/types';

// Tipos
import type { GameViewModel } from '../UI/viewmodels/GameViewModel';
import type { AppConfig } from '../core/types';

// Componentes
import GameScreen from '../UI/screens/GameScreen';

// ==========================================
// CONFIGURACIÓN E INICIALIZACIÓN
// ==========================================
const HUB_URL = "http://192.168.1.129:5251/gameHub";  // ✅ Tu IP real

const appConfig: AppConfig = {
  hubUrl: HUB_URL,
  autoReconnect: true,
  logLevel: 'debug'
};

// Inicializar contenedor IoC ANTES de exportar el componente
console.log('🚀 Inicializando contenedor IoC...');
setupDependencies(appConfig);
console.log('✅ Contenedor IoC inicializado\n');

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function App() {
  // Obtener ViewModel del contenedor IoC
  const viewModel = container.get<GameViewModel>(TYPES.GameViewModel);

  useEffect(() => {
    console.log('🎮 App montada');
    console.log('✅ GameViewModel obtenido del contenedor');
    console.log('🔗 Hub URL:', HUB_URL);
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <GameScreen viewModel={viewModel} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});