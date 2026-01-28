import { observer } from 'mobx-react-lite';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions
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
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375 || height < 667;
  const styles = createStyles(width, height, isSmallScreen);

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
        activeOpacity={0.7}
      >
        <View style={styles.roomHeader}>
          <Text style={styles.roomName} numberOfLines={1}>
            {item.roomName}
          </Text>
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
            {new Date(item.createdAt).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          {item.isFull ? (
            <Text style={styles.fullText}>COMPLETA</Text>
          ) : (
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      {/* Header compacto */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salas de Juego</Text>
        <Text style={styles.headerSubtitle}>Tres en Raya</Text>
        
        <View style={[
          styles.statusIndicator,
          { backgroundColor: isConnected ? '#22c55e' : '#ef4444' }
        ]}>
          <Text style={styles.statusText}>
            {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </Text>
        </View>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {/* Botones de acción */}
        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={[styles.createButton, !isConnected && styles.buttonDisabled]}
            onPress={onCreateRoom}
            disabled={!isConnected}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>➕ Crear Sala</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={!isConnected || isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.refreshButtonText}>
              {isLoading ? '⏳' : '🔄'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de salas */}
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

const createStyles = (width: number, height: number, isSmallScreen: boolean) => {
  const padding = isSmallScreen ? 12 : 16;
  const headerHeight = isSmallScreen ? 110 : 130;
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#6366f1',
    },
    header: {
      height: headerHeight,
      paddingHorizontal: padding * 1.5,
      paddingVertical: padding,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: '#fff',
      fontSize: isSmallScreen ? 22 : 26,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      color: '#e0e7ff',
      fontSize: 12,
      fontWeight: '500',
      marginTop: 4,
      marginBottom: 10,
    },
    statusIndicator: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 16,
    },
    statusText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      backgroundColor: '#f8fafc',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: padding * 1.5,
      paddingHorizontal: padding,
    },
    actionsBar: {
      flexDirection: 'row',
      marginBottom: padding * 1.25,
      gap: 10,
    },
    createButton: {
      flex: 1,
      backgroundColor: '#6366f1',
      borderRadius: 12,
      paddingVertical: 13,
      alignItems: 'center',
      shadowColor: '#6366f1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 4,
    },
    buttonDisabled: {
      backgroundColor: '#94a3b8',
      opacity: 0.6,
    },
    createButtonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
    },
    refreshButton: {
      backgroundColor: '#e2e8f0',
      borderRadius: 12,
      paddingHorizontal: 18,
      paddingVertical: 13,
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 50,
    },
    refreshButtonText: {
      fontSize: 18,
    },
    listContent: {
      flexGrow: 1,
      paddingBottom: padding * 2,
    },
    roomCard: {
      backgroundColor: '#fff',
      borderRadius: 14,
      padding: padding * 1.25,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    roomCardDisabled: {
      opacity: 0.5,
    },
    roomHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    roomName: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1e293b',
      flex: 1,
      marginRight: 12,
    },
    playerBadge: {
      backgroundColor: '#22c55e',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
      minWidth: 45,
      alignItems: 'center',
    },
    playerBadgeFull: {
      backgroundColor: '#ef4444',
    },
    playerCount: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '700',
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
      fontSize: 11,
      fontWeight: '700',
      color: '#ef4444',
    },
    availableText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#22c55e',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Math.min(height * 0.2, 100),
      paddingHorizontal: padding * 2,
    },
    emptyEmoji: {
      fontSize: 56,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: 8,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: '#64748b',
      textAlign: 'center',
      lineHeight: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 15,
      color: '#64748b',
    },
  });
};

export default RoomListScreen;