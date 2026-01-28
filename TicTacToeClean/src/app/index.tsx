import 'reflect-metadata';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { container, setupDependencies } from '../core/container';
import { TYPES } from '../core/types';
import type { GameViewModel } from '../UI/viewmodels/GameViewModel';
import type { AppConfig } from '../core/types';
import RoomListScreen from '../UI/screens/RoomListScreen';
import CreateRoomScreen from '../UI/screens/CreateRoomScreen';
import GameScreen from '../UI/screens/GameScreen';

// Cambia esta URL según tu configuración
const HUB_URL = "http://localhost:5251/gameHub";

const appConfig: AppConfig = { hubUrl: HUB_URL, autoReconnect: true, logLevel: 'debug' };
setupDependencies(appConfig);

const App = observer(() => {
  const [screen, setScreen] = useState<'roomList' | 'game'>('roomList');
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const viewModel = container.get<GameViewModel>(TYPES.GameViewModel);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await viewModel.initialize();
        console.log('✅ App inicializada correctamente');
      } catch (error: any) {
        console.error('❌ Error al inicializar app:', error);
        Alert.alert(
          'Error de Conexión',
          `No se pudo conectar al servidor.\n\nURL: ${HUB_URL}\n\nVerifica que:\n1. El servidor esté ejecutándose\n2. La IP y puerto sean correctos\n3. No haya firewall bloqueando la conexión`,
          [{ text: 'OK' }]
        );
      }
    };

    initializeApp();
  }, []);

  const handleCreateRoom = () => {
    runInAction(() => viewModel.showCreateRoomModal = true);
  };

  const handleCreateRoomSubmit = async (name: string) => {
    try {
      await viewModel.createRoom(name);
      runInAction(() => viewModel.showCreateRoomModal = false);
      await viewModel.refreshRooms();
      
      console.log('✅ Sala creada exitosamente:', name);
      
      Alert.alert(
        'Sala Creada',
        `La sala "${name}" ha sido creada exitosamente.`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('❌ Error al crear sala:', error);
      Alert.alert(
        'Error',
        `No se pudo crear la sala: ${error.message}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleJoinRoom = async (id: string) => {
    try {
      await viewModel.joinRoom(id);
      setCurrentRoomId(id);
      setScreen('game');
      console.log('✅ Unido a sala:', id);
    } catch (error: any) {
      console.error('❌ Error al unirse a sala:', error);
      Alert.alert(
        'Error',
        `No se pudo unir a la sala: ${error.message}`,
        [{ text: 'OK' }]
      );
    }
  };

  // ✅ MODIFICADO: Ahora llama a leaveRoom() para notificar al servidor
  const handleLeaveGame = async () => {
    try {
      console.log('🚪 Usuario saliendo de la sala...');
      
      // Notificar al servidor que estamos saliendo
      await viewModel.leaveRoom();
      
      // Volver a la lista de salas
      setScreen('roomList');
      setCurrentRoomId(null);
      
      console.log('✅ Sala abandonada correctamente');
    } catch (error: any) {
      console.error('❌ Error al abandonar sala:', error);
      
      // Aun si hay error, volver a la lista
      setScreen('roomList');
      setCurrentRoomId(null);
      
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
      Alert.alert(
        'Error',
        `No se pudo actualizar la lista: ${error.message}`,
        [{ text: 'OK' }]
      );
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
          onClose={() => runInAction(() => viewModel.showCreateRoomModal = false)}
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
    backgroundColor: '#fff' 
  } 
});

export default App;