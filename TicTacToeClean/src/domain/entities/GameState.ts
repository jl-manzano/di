/**
 * DOMAIN LAYER - Entidad GameState
 */
import { Player } from './Player';

export class GameState {
  board: string[]; // Array de 9 posiciones
  currentTurn: string; // "X" o "O"
  winner: string | null; // null, "X", "O", o "draw"
  gameOver: boolean;
  playerX: Player | null;
  playerO: Player | null;
  waitingForPlayer: boolean;

  constructor() {
    this.board = Array(9).fill('');
    this.currentTurn = 'X';
    this.winner = null;
    this.gameOver = false;
    this.playerX = null;
    this.playerO = null;
    this.waitingForPlayer = true;
  }

  static fromJSON(json: any): GameState {
    const gameState = new GameState();

    if (!json) {
      return gameState;
    }

    gameState.board = json.board || json.Board || Array(9).fill('');
    gameState.currentTurn = json.currentTurn || json.CurrentTurn || 'X';
    gameState.winner = json.winner !== undefined ? json.winner : json.Winner !== undefined ? json.Winner : null;
    gameState.gameOver = json.gameOver !== undefined ? json.gameOver : json.GameOver !== undefined ? json.GameOver : false;
    gameState.waitingForPlayer = json.waitingForPlayer !== undefined ? json.waitingForPlayer : json.WaitingForPlayer !== undefined ? json.WaitingForPlayer : true;

    if (json.playerX || json.PlayerX) {
      gameState.playerX = Player.fromJSON(json.playerX || json.PlayerX);
    }

    if (json.playerO || json.PlayerO) {
      gameState.playerO = Player.fromJSON(json.playerO || json.PlayerO);
    }

    return gameState;
  }

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

  isBoardFull(): boolean {
    return this.board.every(cell => cell !== '');
  }

  getCellValue(position: number): string {
    if (position < 0 || position > 8) {
      return '';
    }
    return this.board[position];
  }

  isCellEmpty(position: number): boolean {
    if (position < 0 || position > 8) {
      return false;
    }
    return this.board[position] === '';
  }
}