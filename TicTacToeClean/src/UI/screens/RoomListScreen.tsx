import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Animated
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

const RoomCard = ({ item, onJoinRoom }: { item: Room; onJoinRoom: (roomId: string) => void }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const canJoin = item.canJoin();

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.roomCard,
          !canJoin && styles.roomCardDisabled
        ]}
        onPress={() => onJoinRoom(item.roomId)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!canJoin}
        activeOpacity={0.9}
      >
        <View style={styles.roomCardInner}>
          <View style={styles.roomIconContainer}>
            <Text style={styles.roomIcon}>🎯</Text>
          </View>
          
          <View style={styles.roomInfo}>
            <View style={styles.roomHeader}>
              <Text style={styles.roomName} numberOfLines={1}>{item.roomName}</Text>
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
              <View style={styles.timeContainer}>
                <Text style={styles.timeIcon}>🕐</Text>
                <Text style={styles.roomTime}>
                  {new Date(item.createdAt).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              
              <View style={[
                styles.statusBadge,
                item.isFull ? styles.statusBadgeFull : styles.statusBadgeAvailable
              ]}>
                <View style={[
                  styles.statusDot,
                  item.isFull ? styles.statusDotFull : styles.statusDotAvailable
                ]} />
                <Text style={[
                  styles.statusText,
                  item.isFull ? styles.statusTextFull : styles.statusTextAvailable
                ]}>
                  {item.isFull ? 'Completa' : 'Disponible'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {!canJoin && (
          <View style={styles.disabledOverlay}>
            <Text style={styles.disabledIcon}>🔒</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const RoomListScreen = observer(({
  rooms,
  isConnected,
  isLoading,
  onCreateRoom,
  onJoinRoom,
  onRefresh
}: RoomListScreenProps) => {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (!isConnected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isConnected]);

  const renderRoomItem = ({ item, index }: { item: Room; index: number }) => {
    return <RoomCard item={item} onJoinRoom={onJoinRoom} />;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyEmoji}>🎮</Text>
        <View style={styles.emptyIconBg} />
      </View>
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Salas</Text>
            <Text style={styles.headerSubtitle}>Tic Tac Toe Multijugador</Text>
          </View>
          
          <Animated.View style={[
            styles.statusIndicator,
            { 
              backgroundColor: isConnected ? '#22c55e' : '#ef4444',
              transform: [{ scale: !isConnected ? pulseAnim : 1 }]
            }
          ]}>
            <View style={styles.statusContent}>
              <View style={[
                styles.statusDotLarge,
                { backgroundColor: isConnected ? '#dcfce7' : '#fee2e2' }
              ]} />
              <Text style={styles.statusText}>
                {isConnected ? 'Online' : 'Offline'}
              </Text>
            </View>
          </Animated.View>
        </View>

        {rooms.length > 0 && !isLoading && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{rooms.length}</Text>
              <Text style={styles.statLabel}>Salas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {rooms.filter(r => !r.isFull).length}
              </Text>
              <Text style={styles.statLabel}>Disponibles</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={[
              styles.createButton,
              !isConnected && styles.buttonDisabled
            ]}
            onPress={onCreateRoom}
            disabled={!isConnected}
          >
            <Text style={styles.createButtonText}>CREAR SALA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.refreshButton,
              (!isConnected || isLoading) && styles.buttonDisabled
            ]}
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
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  headerSubtitle: {
    color: '#e0e7ff',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  statusIndicator: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDotLarge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    backdropFilter: 'blur(10px)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#e0e7ff',
    fontSize: 12,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    paddingTop: 24,
  },
  actionsBar: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonIcon: {
    fontSize: 18,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  refreshButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshButtonText: {
    fontSize: 22,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  roomCardDisabled: {
    opacity: 0.6,
  },
  roomCardInner: {
    flexDirection: 'row',
    padding: 18,
    gap: 14,
  },
  roomIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomIcon: {
    fontSize: 28,
  },
  roomInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  playerBadge: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  playerBadgeFull: {
    backgroundColor: '#ef4444',
  },
  playerCount: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeIcon: {
    fontSize: 14,
  },
  roomTime: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  statusBadgeAvailable: {
    backgroundColor: '#dcfce7',
  },
  statusBadgeFull: {
    backgroundColor: '#fee2e2',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotAvailable: {
    backgroundColor: '#22c55e',
  },
  statusDotFull: {
    backgroundColor: '#ef4444',
  },
  statusTextAvailable: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22c55e',
  },
  statusTextFull: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444',
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomLeftRadius: 16,
    borderTopRightRadius: 20,
  },
  disabledIcon: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 80,
    zIndex: 1,
  },
  emptyIconBg: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    top: '50%',
    left: '50%',
    marginTop: -60,
    marginLeft: -60,
    zIndex: 0,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  emptyButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
    fontWeight: '500',
  },
});

export default RoomListScreen;