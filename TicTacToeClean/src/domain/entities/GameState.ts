import { makeAutoObservable } from 'mobx';
import { Player } from './Player';

export class GameState {
  private _board: string[] = Array(9).fill('');
  private _currentTurn = 'X';
  private _winner: string | null = null;
  private _gameOver = false;

  private _playerX: Player | null = null;
  private _playerO: Player | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // ===== GETTERS =====

  get board(): string[] {
    return this._board;
  }

  get currentTurn(): string {
    return this._currentTurn;
  }

  get winner(): string | null {
    return this._winner;
  }

  get gameOver(): boolean {
    return this._gameOver;
  }

  get playerX(): Player | null {
    return this._playerX;
  }

  get playerO(): Player | null {
    return this._playerO;
  }

  get waitingForPlayer(): boolean {
    return this._playerX === null || this._playerO === null;
  }

  // ===== JUGADORES =====

  assignPlayer(player: Player): void {
    if (player.symbol === 'X') {
      this._playerX = player;
    } else if (player.symbol === 'O') {
      this._playerO = player;
    }
  }

  removePlayer(symbol: string): void {
    if (symbol === 'X') {
      this._playerX = null;
    } else if (symbol === 'O') {
      this._playerO = null;
    }
  }

  clearPlayers(): void {
    this._playerX = null;
    this._playerO = null;
  }

  // ===== JUEGO =====

  makeMove(position: number, symbol: string): boolean {
    let success = true;

    if (this._gameOver) {
      success = false;
    } else if (this.waitingForPlayer) {
      success = false;
    } else if (position < 0 || position > 8) {
      success = false;
    } else if (this._board[position] !== '') {
      success = false;
    } else if (symbol !== this._currentTurn) {
      success = false;
    }

    if (success) {
      this._board[position] = symbol;
      this.checkGameResult();

      if (!this._gameOver) {
        this._currentTurn = this._currentTurn === 'X' ? 'O' : 'X';
      }
    }

    return success;
  }

  reset(): void {
    this._board = Array(9).fill('');
    this._currentTurn = 'X';
    this._winner = null;
    this._gameOver = false;
  }

  isCellEmpty(position: number): boolean {
    let empty = false;

    if (position >= 0 && position <= 8) {
      empty = this._board[position] === '';
    }

    return empty;
  }

  // ===== LÓGICA INTERNA =====

  private checkGameResult(): void {
    const winner = this.checkWinner();

    if (winner !== null) {
      this._winner = winner;
      this._gameOver = true;
    } else {
      const full = this._board.every(c => c !== '');
      if (full) {
        this._winner = 'draw';
        this._gameOver = true;
      }
    }
  }

  private checkWinner(): string | null {
    let result: string | null = null;

    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (let i = 0; i < wins.length && result === null; i++) {
      const [a, b, c] = wins[i];

      if (
        this._board[a] &&
        this._board[a] === this._board[b] &&
        this._board[a] === this._board[c]
      ) {
        result = this._board[a];
      }
    }

    return result;
  }
}
