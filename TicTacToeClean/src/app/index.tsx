import 'reflect-metadata';
import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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

const HUB_URL = "http://192.168.100.178:5251/gameHub";

const appConfig: AppConfig = { hubUrl: HUB_URL, autoReconnect: true, logLevel: 'debug' };
setupDependencies(appConfig);

const App = observer(() => {
  const [screen, setScreen] = useState<'roomList' | 'game'>('roomList');
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const viewModel = container.get<GameViewModel>(TYPES.GameViewModel);

  useEffect(() => {
    viewModel.initialize();
  }, []);

  const handleCreateRoom = () => runInAction(() => viewModel.showCreateRoomModal = true);
  const handleCreateRoomSubmit = async (name: string) => await viewModel.createRoom(name);
  const handleJoinRoom = async (id: string) => { await viewModel.joinRoom(id); setCurrentRoomId(id); setScreen('game'); };
  const handleLeaveGame = async () => { setScreen('roomList'); setCurrentRoomId(null); await viewModel.refreshRooms(); };
  const handleRefreshRooms = async () => await viewModel.refreshRooms();

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

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' } });

export default App;
