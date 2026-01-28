import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { GameViewModel } from '../viewmodels/GameViewModel';

interface Props {
  viewModel: GameViewModel;
  onLeave: () => void;
}

const { width, height } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width * 0.9, 360);
const CELL_SIZE = BOARD_SIZE / 3;

const GameScreen = observer(({ viewModel, onLeave }: Props) => {
  const styles = createStyles(width, height, CELL_SIZE, BOARD_SIZE);
  const { gameState } = viewModel;

  if (!viewModel.isConnected) {
    return (
      <View style={styles.waitingContainer}>
        <Text>Conectando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onLeave}>
          <Text style={styles.backButtonText}>Salir</Text>
        </TouchableOpacity>

        {viewModel.mySymbol && (
          <View style={styles.yourSymbolBadge}>
            <Text style={styles.yourSymbolText}>
              Tu símbolo: {viewModel.mySymbol}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.gameCard}>
        <View
          style={[
            styles.turnIndicator,
            viewModel.isMyTurn && styles.turnIndicatorActive,
          ]}
        >
          <Text style={styles.turnText}>
            {viewModel.isMyTurn ? 'Tu turno' : 'Turno del rival'}
          </Text>
        </View>

        <View style={styles.boardContainer}>
          {[0, 1, 2].map((row) => (
            <View key={row} style={styles.row}>
              {[0, 1, 2].map((col) => {
                const index = row * 3 + col;
                const value = gameState.board[index];

                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.cell}
                    disabled={!viewModel.isMyTurn || value !== null}
                    onPress={() => viewModel.handleCellPress(index)}
                  >
                    <Text style={styles.cellText}>{value}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {gameState.gameOver && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => viewModel.resetGame()}
          >
            <Text style={styles.resetButtonText}>Reiniciar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
});

const createStyles = (
  width: number,
  height: number,
  cellSize: number,
  boardWidth: number
) =>
  StyleSheet.create({
    mainContainer: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: '#6366f1',
    },
    header: {
      marginBottom: 16,
    },
    backButtonText: {
      color: '#fff',
      fontWeight: '700',
    },
    yourSymbolBadge: {
      marginTop: 8,
      backgroundColor: '#fff',
      padding: 8,
      borderRadius: 12,
    },
    yourSymbolText: {
      fontWeight: '700',
    },
    gameCard: {
      backgroundColor: '#f8fafc',
      borderRadius: 24,
      padding: 16,
    },
    turnIndicator: {
      alignSelf: 'center',
      padding: 8,
      borderRadius: 16,
      marginBottom: 16,
      backgroundColor: '#cbd5e1',
    },
    turnIndicatorActive: {
      backgroundColor: '#22c55e',
    },
    turnText: {
      fontWeight: '700',
    },
    boardContainer: {
      width: boardWidth,
      alignSelf: 'center',
    },
    row: {
      flexDirection: 'row',
    },
    cell: {
      width: cellSize,
      height: cellSize,
      margin: 4,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    cellText: {
      fontSize: cellSize * 0.5,
      fontWeight: '700',
    },
    resetButton: {
      marginTop: 24,
      backgroundColor: '#6366f1',
      padding: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    resetButtonText: {
      color: '#fff',
      fontWeight: '700',
    },
    waitingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default GameScreen;
