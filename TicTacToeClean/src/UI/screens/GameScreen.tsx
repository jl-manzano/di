import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameViewModel } from '../../UI/viewmodels/GameViewModel';

interface GameScreenProps {
  viewModel: GameViewModel;
  onLeave?: () => void;
}

const { width } = Dimensions.get('window');
const isWeb = width > 500;
const BOARD_SIZE = isWeb ? Math.min(width * 0.4, 400) : Math.min(width * 0.88, 360);
const CELL_SIZE = (BOARD_SIZE - 24) / 3;

const GameScreen = observer(({ viewModel, onLeave }: GameScreenProps) => {
  // Estado local para guardar datos del modal y evitar flash de "null"
  const [modalData, setModalData] = useState<{
    winner: string;
    emoji: string;
    title: string;
    subtitle: string;
  } | null>(null);

  // Detectar cambios en el estado del juego
  useEffect(() => {
    const { gameOver, winner } = viewModel.gameState;
    
    if (gameOver && winner && (winner === 'X' || winner === 'O' || winner === 'draw')) {
      // Juego terminó - guardar datos y mostrar modal
      const emoji = winner === 'draw' ? '🤝' : '🏆';
      const title = winner === 'draw' ? '¡EMPATE!' : `¡GANÓ ${winner}!`;
      const subtitle = winner === 'draw' 
        ? 'Buen juego' 
        : (winner === viewModel.mySymbol ? '¡Felicidades!' : 'Mejor suerte la próxima');
      
      setModalData({ winner, emoji, title, subtitle });
    } else if (!gameOver) {
      // Juego reseteado (desde servidor) - cerrar modal para ambos jugadores
      setModalData(null);
    }
  }, [viewModel.gameState.gameOver, viewModel.gameState.winner, viewModel.mySymbol]);

  const handleCellPress = (position: number) => {
    viewModel.handleCellPress(position);
  };

  const handleReset = () => {
    // Solo envía el reset al servidor - el modal se cerrará automáticamente
    // cuando llegue el evento ResetBroadcasted a ambos jugadores
    viewModel.resetGame();
  };

  const renderCell = (position: number) => {
    const value = viewModel.gameState.board[position];
    const isEmpty = !value || value === '';
    
    const canInteract = viewModel.isMyTurn && 
                       !viewModel.gameState.gameOver && 
                       !viewModel.gameState.waitingForPlayer;

    return (
      <TouchableOpacity
        key={position}
        style={[
          styles.cell,
          !isEmpty && styles.cellFilled,
          !canInteract && styles.cellDisabled
        ]}
        onPress={() => handleCellPress(position)}
        disabled={!isEmpty || !canInteract}
      >
        <Text
          style={[
            styles.cellText,
            value === 'X' && styles.cellTextX,
            value === 'O' && styles.cellTextO
          ]}
        >
          {value || ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const getStatusMessage = () => {
    if (viewModel.gameState.waitingForPlayer) {
      return 'Esperando jugador...';
    }
    if (viewModel.gameState.gameOver) {
      if (viewModel.gameState.winner === 'draw') return '¡Empate!';
      if (viewModel.gameState.winner === viewModel.mySymbol) return '¡Ganaste!';
      return 'Perdiste';
    }
    if (viewModel.isMyTurn) {
      return `Tu turno (${viewModel.mySymbol})`;
    }
    return 'Turno del rival';
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        {onLeave && (
          <TouchableOpacity style={styles.backButton} onPress={onLeave}>
            <Text style={styles.backButtonText}>← Salas</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>Tic Tac Toe</Text>
        
        <View style={[
          styles.statusIndicator,
          { backgroundColor: viewModel.isConnected ? '#22c55e' : '#ef4444' }
        ]}>
          <Text style={styles.statusText}>
            {viewModel.isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </Text>
        </View>

        <View style={styles.turnIndicator}>
          <Text style={styles.turnText}>{getStatusMessage()}</Text>
        </View>
      </View>

      {/* Game Content */}
      <View style={styles.gameCard}>
        {viewModel.gameState.waitingForPlayer ? (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingEmoji}>⏳</Text>
            <Text style={styles.waitingText}>Esperando oponente...</Text>
            <Text style={styles.waitingSubtext}>
              Abre la app en otro dispositivo
            </Text>
          </View>
        ) : (
          <View style={styles.gameContent}>
            {/* Players Info */}
            <View style={styles.playersInfo}>
              <View style={styles.playerCard}>
                <Text style={styles.playerSymbol}>❌</Text>
                <Text style={styles.playerLabel}>Jugador X</Text>
                {viewModel.gameState.currentTurn === 'X' && 
                 !viewModel.gameState.gameOver && (
                  <View style={styles.activeTurnDot} />
                )}
              </View>
              
              <Text style={styles.vs}>VS</Text>
              
              <View style={styles.playerCard}>
                <Text style={styles.playerSymbol}>⭕</Text>
                <Text style={styles.playerLabel}>Jugador O</Text>
                {viewModel.gameState.currentTurn === 'O' && 
                 !viewModel.gameState.gameOver && (
                  <View style={styles.activeTurnDot} />
                )}
              </View>
            </View>

            {/* Board */}
            <View style={styles.boardContainer}>
              {[0, 1, 2].map((row) => (
                <View key={row} style={styles.row}>
                  {[0, 1, 2].map((col) => {
                    const position = row * 3 + col;
                    return renderCell(position);
                  })}
                </View>
              ))}
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={[
                styles.resetButton,
                !viewModel.isConnected && styles.resetButtonDisabled
              ]}
              onPress={handleReset}
              disabled={!viewModel.isConnected}
            >
              <Text style={styles.resetButtonText}>🔄 Nuevo Juego</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Result Modal Popup - Se cierra automáticamente cuando el servidor resetea */}
      <Modal
        visible={modalData !== null}
        transparent
        animationType="fade"
        onRequestClose={handleReset}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.resultModal,
            modalData?.winner === 'draw' ? styles.resultModalDraw : styles.resultModalWin
          ]}>
            <Text style={styles.resultEmoji}>{modalData?.emoji}</Text>
            <Text style={styles.resultTitle}>{modalData?.title}</Text>
            <Text style={styles.resultSubtitle}>{modalData?.subtitle}</Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleReset}
            >
              <Text style={styles.modalButtonText}>🔄 Jugar de Nuevo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#6366f1',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  turnIndicator: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  turnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  gameCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  gameContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  waitingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  waitingSubtext: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  playersInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  playerCard: {
    alignItems: 'center',
    position: 'relative',
  },
  playerSymbol: {
    fontSize: isWeb ? 36 : 30,
    marginBottom: 4,
  },
  playerLabel: {
    fontSize: isWeb ? 14 : 12,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTurnDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  vs: {
    fontSize: isWeb ? 18 : 14,
    fontWeight: '700',
    color: '#94a3b8',
  },
  boardContainer: {
    alignSelf: 'center',
    width: BOARD_SIZE,
    backgroundColor: '#e2e8f0',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#fff',
    margin: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cellFilled: {
    backgroundColor: '#f1f5f9',
  },
  cellDisabled: {
    opacity: 0.6,
  },
  cellText: {
    fontSize: isWeb ? 48 : 38,
    fontWeight: '700',
  },
  cellTextX: {
    color: '#ef4444',
  },
  cellTextO: {
    color: '#3b82f6',
  },
  resetButton: {
    backgroundColor: '#6366f1',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  resetButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultModal: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  resultModalWin: {
    backgroundColor: '#fef3c7',
  },
  resultModalDraw: {
    backgroundColor: '#e0e7ff',
  },
  resultEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 28,
  },
  modalButton: {
    backgroundColor: '#6366f1',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default GameScreen;