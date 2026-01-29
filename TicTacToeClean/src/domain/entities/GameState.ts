import { makeObservable, observable, action, computed } from 'mobx';
import { Player } from './Player';

export class GameState {
  board: string[];
  currentTurn: string;
  winner: string | null;
  gameOver: boolean;
  playerX: Player | null;
  playerO: Player | null;

  constructor() {
    this.board = Array(9).fill('');
    this.currentTurn = 'X';
    this.winner = null;
    this.gameOver = false;
    this.playerX = null;
    this.playerO = null;

    makeObservable(this, {
      board: observable,
      currentTurn: observable,
      winner: observable,
      gameOver: observable,
      playerX: observable,
      playerO: observable,
      makeMove: action,
      reset: action,
      waitingForPlayer: computed
    });
  }

  /**
   * Verifica si estamos esperando al segundo jugador
   */
  get waitingForPlayer(): boolean {
    return this.playerX === null || this.playerO === null;
  }

  /**
   * Realiza un movimiento en el tablero
   * ✅ VALIDA todo del lado del cliente
   * 
   * @param position Posición del tablero (0-8)
   * @param symbol Símbolo del jugador ('X' o 'O')
   * @returns true si el movimiento fue exitoso, false si no
   */
  makeMove(position: number, symbol: string): boolean {
    // Validaciones
    if (this.gameOver) {
      console.warn('⚠️ El juego ya terminó');
      return false;
    }

    if (this.waitingForPlayer) {
      console.warn('⚠️ Esperando al segundo jugador');
      return false;
    }

    if (position < 0 || position > 8) {
      console.warn('⚠️ Posición inválida:', position);
      return false;
    }

    if (!this.isCellEmpty(position)) {
      console.warn('⚠️ Celda ocupada:', position);
      return false;
    }

    if (symbol !== this.currentTurn) {
      console.warn('⚠️ No es el turno de', symbol);
      return false;
    }

    // Realizar movimiento
    this.board[position] = symbol;
    console.log(`✅ Movimiento: ${symbol} en posición ${position}`);

    // Verificar resultado
    this.checkGameResult();

    // Cambiar turno si el juego no terminó
    if (!this.gameOver) {
      this.switchTurn();
    }

    return true;
  }

  /**
   * Verifica si hay ganador o empate
   */
  private checkGameResult(): void {
    const winner = this.checkWinner();
    if (winner) {
      this.winner = winner;
      this.gameOver = true;
      console.log('🏆 Ganador:', winner);
      return;
    }

    if (this.isBoardFull()) {
      this.winner = 'draw';
      this.gameOver = true;
      console.log('🤝 Empate');
      return;
    }
  }

  /**
   * Verifica todas las combinaciones ganadoras
   */
  private checkWinner(): string | null {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.board[a];
      }
    }

    return null;
  }

  /**
   * Cambia el turno
   */
  private switchTurn(): void {
    this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X';
  }

  /**
   * Verifica si el tablero está lleno
   */
  isBoardFull(): boolean {
    return this.board.every(cell => cell !== '');
  }

  /**
   * Verifica si una celda está vacía
   */
  isCellEmpty(position: number): boolean {
    if (position < 0 || position > 8) return false;
    return this.board[position] === '';
  }

  /**
   * Obtiene el valor de una celda
   */
  getCellValue(position: number): string {
    if (position < 0 || position > 8) return '';
    return this.board[position];
  }

  /**
   * Reinicia el juego
   */
  reset(): void {
    this.board = Array(9).fill('');
    this.currentTurn = 'X';
    this.winner = null;
    this.gameOver = false;
    console.log('🔄 Juego reiniciado');
  }

  /**
   * Crea instancia desde JSON (para sincronización inicial)
   */
  static fromJSON(json: any): GameState {
    const gameState = new GameState();
    if (!json) return gameState;

    gameState.board = json.board || json.Board || Array(9).fill('');
    gameState.currentTurn = json.currentTurn || json.CurrentTurn || 'X';
    gameState.winner = json.winner !== undefined ? json.winner : json.Winner !== undefined ? json.Winner : null;
    gameState.gameOver = json.gameOver !== undefined ? json.gameOver : json.GameOver !== undefined ? json.GameOver : false;

    if (json.playerX || json.PlayerX) {
      gameState.playerX = Player.fromJSON(json.playerX || json.PlayerX);
    }

    if (json.playerO || json.PlayerO) {
      gameState.playerO = Player.fromJSON(json.playerO || json.PlayerO);
    }

    return gameState;
  }

  /**
   * Convierte a JSON
   */
  toJSON(): object {
    return {
      board: this.board,
      currentTurn: this.currentTurn,
      winner: this.winner,
      gameOver: this.gameOver,
      playerX: this.playerX?.toJSON() || null,
      playerO: this.playerO?.toJSON() || null,
      waitingForPlayer: this.waitingForPlayer
    };
  }
}