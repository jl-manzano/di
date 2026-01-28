import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameViewModel } from '../../UI/viewmodels/GameViewModel';

interface GameScreenProps {
  viewModel: GameViewModel;
}

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 80) / 3;

const GameScreen = observer(({ viewModel }: GameScreenProps) => {
  useEffect(() => {
    viewModel.initialize();
    return () => {
      viewModel.disconnect();
    };
  }, []);

  useEffect(() => {
    if (viewModel.errorMessage) {
      Alert.alert('Aviso', viewModel.errorMessage);
    }
  }, [viewModel.errorMessage]);

  const handleCellPress = (position: number) => {
    viewModel.handleCellPress(position);
  };

  const handleReset = () => {
    Alert.alert(
      'Reiniciar Juego',
      '¿Estás seguro de que quieres reiniciar el juego?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', onPress: () => viewModel.resetGame() }
      ]
    );
  };

  const renderCell = (position: number) => {
    const value = viewModel.gameState.getCellValue(position);
    const isEmpty = viewModel.gameState.isCellEmpty(position);
    const canInteract = viewModel.canInteract;

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
          {value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const cells = [];
      for (let j = 0; j < 3; j++) {
        const position = i * 3 + j;
        cells.push(renderCell(position));
      }
      rows.push(
        <View key={i} style={styles.row}>
          {cells}
        </View>
      );
    }
    return rows;
  };

  const getResultMessage = () => {
    if (!viewModel.gameState.gameOver) {
      return null;
    }

    if (viewModel.gameState.winner === 'draw') {
      return (
        <View style={[styles.resultCard, styles.resultDraw]}>
          <Text style={styles.resultEmoji}>🤝</Text>
          <Text style={styles.resultTitle}>¡EMPATE!</Text>
          <Text style={styles.resultSubtitle}>Buen juego</Text>
        </View>
      );
    }

    return (
      <View style={[styles.resultCard, styles.resultWin]}>
        <Text style={styles.resultEmoji}>🏆</Text>
        <Text style={styles.resultTitle}>
          ¡GANÓ {viewModel.gameState.winner}!
        </Text>
        <Text style={styles.resultSubtitle}>¡Felicidades!</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tres en Raya</Text>
        <Text style={styles.headerSubtitle}>Clean Architecture + MVVM</Text>
        
        <View style={[
          styles.statusIndicator,
          { backgroundColor: viewModel.isConnected ? '#22c55e' : '#ef4444' }
        ]}>
          <Text style={styles.statusText}>
            {viewModel.isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </Text>
        </View>

        <View style={styles.turnIndicator}>
          <Text style={styles.turnText}>
            {viewModel.statusMessage}
          </Text>
        </View>
      </View>

      <View style={styles.gameCard}>
        {viewModel.gameState.waitingForPlayer ? (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingEmoji}>⏳</Text>
            <Text style={styles.waitingText}>Esperando oponente...</Text>
            <Text style={styles.waitingSubtext}>
              Abre la app en otro dispositivo para comenzar
            </Text>
          </View>
        ) : (
          <>
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

            <View style={styles.boardContainer}>
              {renderBoard()}
            </View>

            {getResultMessage()}

            <TouchableOpacity
              style={[
                styles.resetButton,
                !viewModel.isConnected && styles.resetButtonDisabled
              ]}
              onPress={handleReset}
              disabled={!viewModel.isConnected}
            >
              <Text style={styles.resetButtonText}>
                🔄 Nuevo Juego
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#6366f1',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  turnIndicator: {
    marginTop: 12,
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
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  waitingEmoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  waitingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  waitingSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  playersInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  playerCard: {
    alignItems: 'center',
    position: 'relative',
  },
  playerSymbol: {
    fontSize: 32,
    marginBottom: 4,
  },
  playerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTurnDot: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#fff',
  },
  vs: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94a3b8',
  },
  boardContainer: {
    alignSelf: 'center',
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
    fontSize: 48,
    fontWeight: '700',
  },
  cellTextX: {
    color: '#ef4444',
  },
  cellTextO: {
    color: '#3b82f6',
  },
  resultCard: {
    marginTop: 30,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultWin: {
    backgroundColor: '#fef3c7',
  },
  resultDraw: {
    backgroundColor: '#e0e7ff',
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  resetButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
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
});

export default GameScreen;