/**
 * @file App.tsx
 * @summary Componente raíz de la aplicación Tic Tac Toe multijugador.
 * 
 * Punto de entrada principal que configura el contenedor de dependencias,
 * inicializa el ViewModel y gestiona la navegación entre pantallas.
 * 
 * Flujo de la aplicación:
 * 1. Crea el contenedor IoC con la configuración
 * 2. Obtiene el GameViewModel singleton
 * 3. Inicializa la conexión al servidor SignalR
 * 4. Muestra RoomListScreen para seleccionar/crear sala
 * 5. Navega a GameScreen al unirse a una sala
 * 
 * Pantallas:
 * - roomList: Lista de salas disponibles + modal de creación
 * - game: Pantalla del tablero de juego
 * 
 * El componente es un observer de MobX para reactividad automática.
 */

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'reflect-metadata';

import { createContainer, getGameViewModel } from '../core/container';
import type { AppConfig } from '../core/types';

import CreateRoomScreen from '../UI/screens/CreateRoomScreen';
import GameScreen from '../UI/screens/GameScreen';
import RoomListScreen from '../UI/screens/RoomListScreen';

/** URL del hub SignalR del servidor de juego */
const HUB_URL = 'https://tictactoeserver-dyb5dggmhyhfa2gh.spaincentral-01.azurewebsites.net/gameHub';

/** Configuración de la aplicación */
const appConfig: AppConfig = {
  hubUrl: HUB_URL,
  autoReconnect: true,
  logLevel: 'debug',
};

/**
 * Componente raíz de la aplicación.
 * Gestiona la navegación y ciclo de vida de la conexión.
 */
const App = observer(() => {
  /** Pantalla actual ('roomList' o 'game') */
  const [screen, setScreen] = useState<'roomList' | 'game'>('roomList');

  /** Contenedor de inyección de dependencias (singleton) */
  const [container] = useState(() => createContainer(appConfig));
  /** ViewModel principal del juego */
  const [viewModel] = useState(() => getGameViewModel(container));

  // Inicialización y cleanup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await viewModel.initialize();
      } catch (error: any) {
        console.error('Error al inicializar app:', error);
        Alert.alert(
          'Error de Conexión',
          `No se pudo conectar al servidor.\n\nURL: ${HUB_URL}\n\nVerifica que:\n1. El servidor esté ejecutándose\n2. La URL sea correcta\n3. No haya firewall bloqueando la conexión`,
          [{ text: 'OK' }]
        );
      }
    };

    initializeApp();

    return () => {
      viewModel.disconnect().catch((err) => console.error('Error en cleanup:', err));
    };
  }, [viewModel]);

  /**
   * Abre el modal para crear una nueva sala.
   */
  const handleCreateRoom = () => {
    runInAction(() => {
      viewModel.showCreateRoomModal = true;
    });
  };

  /**
   * Maneja el submit del formulario de creación de sala.
   */
  const handleCreateRoomSubmit = async (name: string) => {
    const trimmed = name.trim();

    if (trimmed.length < 3) {
      Alert.alert(
        'Nombre demasiado corto',
        'El nombre de la sala debe tener al menos 3 caracteres.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await viewModel.createRoom(trimmed);

      runInAction(() => {
        viewModel.showCreateRoomModal = false;
      });

      await viewModel.refreshRooms();

      Alert.alert('Sala Creada', `La sala "${trimmed}" ha sido creada exitosamente.`, [
        { text: 'OK' },
      ]);
    } catch (error: any) {
      console.error('Error al crear sala:', error);
      Alert.alert('Error', `No se pudo crear la sala: ${error.message}`, [{ text: 'OK' }]);
    }
  };

  /**
   * Une al jugador a una sala y navega a la pantalla de juego.
   */
  const handleJoinRoom = async (id: string) => {
    try {
      await viewModel.joinRoom(id);
      setScreen('game');
    } catch (error: any) {
      console.error('Error al unirse a sala:', error);
      Alert.alert('Error', `No se pudo unir a la sala: ${error.message}`, [{ text: 'OK' }]);
    }
  };

  /**
   * Abandona la sala actual y vuelve a la lista de salas.
   */
  const handleLeaveGame = async () => {
    try {
      await viewModel.leaveRoom();
      viewModel.gameState.reset();
      setScreen('roomList');
    } catch (error: any) {
      console.error('Error al abandonar sala:', error);
      viewModel.gameState.reset();
      setScreen('roomList');
      Alert.alert(
        'Aviso',
        'Saliste de la sala, pero puede haber ocurrido un error al notificar al servidor.',
        [{ text: 'OK' }]
      );
    }
  };

  /**
   * Refresca la lista de salas disponibles.
   */
  const handleRefreshRooms = async () => {
    try {
      await viewModel.refreshRooms();
    } catch (error: any) {
      console.error('Error al actualizar salas:', error);
      Alert.alert('Error', `No se pudo actualizar la lista: ${error.message}`, [{ text: 'OK' }]);
    }
  };

  // Renderizado de la pantalla de lista de salas
  if (screen === 'roomList') {
    return (
      <SafeAreaProvider>
        <RoomListScreen
          rooms={viewModel.rooms}
          isConnected={viewModel.isConnected}
          isLoading={viewModel.isLoadingRooms}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onRefresh={handleRefreshRooms}
        />

        <CreateRoomScreen
          visible={viewModel.showCreateRoomModal}
          onClose={() =>
            runInAction(() => {
              viewModel.showCreateRoomModal = false;
            })
          }
          onCreate={handleCreateRoomSubmit}
        />
      </SafeAreaProvider>
    );
  }

  // Renderizado de la pantalla de juego
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <GameScreen viewModel={viewModel} onLeave={handleLeaveGame} />
      </View>
    </SafeAreaProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;