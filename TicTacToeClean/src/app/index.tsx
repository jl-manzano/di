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

const HUB_URL = 'http://localhost:5251/gameHub';

const appConfig: AppConfig = {
  hubUrl: HUB_URL,
  autoReconnect: true,
  logLevel: 'debug',
};

const App = observer(() => {
  const [screen, setScreen] = useState<'roomList' | 'game'>('roomList');

  const [container] = useState(() => {
    console.log('🎮 Creando contenedor para esta instancia de App...');
    return createContainer(appConfig);
  });

  const [viewModel] = useState(() => {
    console.log('🎮 Obteniendo ViewModel del contenedor...');
    return getGameViewModel(container);
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Inicializando App con contenedor único...');
        await viewModel.initialize();
        console.log('✅ App inicializada correctamente');
      } catch (error: any) {
        console.error('❌ Error al inicializar app:', error);

        Alert.alert(
          'Error de Conexión',
          `No se pudo conectar al servidor.\n\nURL: ${HUB_URL}\n\nVerifica que:\n1. El servidor esté ejecutándose\n2. La URL sea correcta\n3. No haya firewall bloqueando la conexión`,
          [{ text: 'OK' }]
        );
      }
    };

    initializeApp();

    return () => {
      console.log('🧹 Limpiando conexión...');
      viewModel.disconnect().catch((err) => console.error('Error en cleanup:', err));
    };
  }, [viewModel]);

  const handleCreateRoom = () => {
    runInAction(() => {
      viewModel.showCreateRoomModal = true;
    });
  };

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

      console.log('✅ Sala creada exitosamente:', trimmed);

      Alert.alert('Sala Creada', `La sala "${trimmed}" ha sido creada exitosamente.`, [
        { text: 'OK' },
      ]);
    } catch (error: any) {
      console.error('❌ Error al crear sala:', error);

      Alert.alert('Error', `No se pudo crear la sala: ${error.message}`, [{ text: 'OK' }]);
    }
  };

  const handleJoinRoom = async (id: string) => {
    try {
      await viewModel.joinRoom(id);
      setScreen('game');
      console.log('✅ Unido a sala:', id);
    } catch (error: any) {
      console.error('❌ Error al unirse a sala:', error);

      Alert.alert('Error', `No se pudo unir a la sala: ${error.message}`, [{ text: 'OK' }]);
    }
  };

  const handleLeaveGame = async () => {
    try {
      console.log('🚪 Usuario saliendo de la sala...');
      await viewModel.leaveRoom();
      setScreen('roomList');
      console.log('✅ Sala abandonada correctamente');
    } catch (error: any) {
      console.error('❌ Error al abandonar sala:', error);

      setScreen('roomList');

      Alert.alert(
        'Aviso',
        'Saliste de la sala, pero puede haber ocurrido un error al notificar al servidor.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRefreshRooms = async () => {
    try {
      await viewModel.refreshRooms();
      console.log('✅ Lista de salas actualizada');
    } catch (error: any) {
      console.error('❌ Error al actualizar salas:', error);

      Alert.alert('Error', `No se pudo actualizar la lista: ${error.message}`, [{ text: 'OK' }]);
    }
  };

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
