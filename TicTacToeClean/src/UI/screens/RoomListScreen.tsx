import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Room } from '../../domain/entities/Room';

interface RoomListScreenProps {
  rooms: Room[];
  isConnected: boolean;
  isLoading: boolean;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  onRefresh: () => void;
}

const RoomListScreen = observer(({
  rooms,
  isConnected,
  isLoading,
  onCreateRoom,
  onJoinRoom,
  onRefresh
}: RoomListScreenProps) => {

  const renderRoomItem = ({ item }: { item: Room }) => {
    const canJoin = item.canJoin();

    return (
      <TouchableOpacity
        style={[
          styles.roomCard,
          !canJoin && styles.roomCardDisabled
        ]}
        onPress={() => onJoinRoom(item.roomId)}
        disabled={!canJoin}
      >
        <View style={styles.roomHeader}>
          <Text style={styles.roomName}>{item.roomName}</Text>
          <View style={[
            styles.playerBadge,
            item.isFull && styles.playerBadgeFull
          ]}>
            <Text style={styles.playerCount}>
              {item.getPlayerCountText()}
            </Text>
          </View>
        </View>

        <View style={styles.roomFooter}>
          <Text style={styles.roomTime}>
            Creada: {new Date(item.createdAt).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          {item.isFull && (
            <Text style={styles.fullText}>COMPLETA</Text>
          )}
          {!item.isFull && (
            <Text style={styles.availableText}>DISPONIBLE</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🎮</Text>
      <Text style={styles.emptyTitle}>No hay salas disponibles</Text>
      <Text style={styles.emptySubtitle}>
        Crea una nueva sala para empezar a jugar
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salas</Text>
        <Text style={styles.headerSubtitle}>Tic Tac Toe</Text>

        <View style={[
          styles.statusIndicator,
          { backgroundColor: isConnected ? '#22c55e' : '#ef4444' }
        ]}>
          <Text style={styles.statusText}>
            {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={onCreateRoom}
            disabled={!isConnected}
          >
            <Text style={styles.createButtonText}>Crear Sala</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={!isConnected || isLoading}
          >
            <Text style={styles.refreshButtonText}>
              {isLoading ? '⏳' : '🔄'}
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Cargando salas...</Text>
          </View>
        ) : (
          <FlatList
            data={rooms}
            renderItem={renderRoomItem}
            keyExtractor={(item) => item.roomId}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366f1',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#e0e7ff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 12,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  actionsBar: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 20,
  },
  listContent: {
    flexGrow: 1,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roomCardDisabled: {
    opacity: 0.6,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  playerBadge: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  playerBadgeFull: {
    backgroundColor: '#ef4444',
  },
  playerCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomTime: {
    fontSize: 12,
    color: '#64748b',
  },
  fullText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  availableText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22c55e',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
});

export default RoomListScreen;