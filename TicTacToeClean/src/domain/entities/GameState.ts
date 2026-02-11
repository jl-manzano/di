/**
 * @file GameState.ts
 * @summary Entidad de dominio que representa el estado completo de una partida.
 * 
 * Esta clase encapsula toda la lógica del estado del juego Tic Tac Toe,
 * incluyendo el tablero, turnos, jugadores y detección de victoria/empate.
 * Utiliza MobX para reactividad automática en la UI.
 * 
 * Responsabilidades:
 * - Mantener el estado del tablero (9 celdas)
 * - Gestionar los turnos de los jugadores
 * - Detectar condiciones de victoria y empate
 * - Asignar y gestionar jugadores X y O
 * - Proporcionar métodos para realizar movimientos y resetear el juego
 */

import { makeAutoObservable } from 'mobx';
import { Player } from './Player';

export class GameState {
  /** Tablero de 9 posiciones (índices 0-8), vacío = '' */
  private _board: string[] = Array(9).fill('');
  /** Símbolo del jugador que tiene el turno actual ('X' o 'O') */
  private _currentTurn = 'X';
  /** Ganador del juego ('X', 'O', 'draw') o null si no ha terminado */
  private _winner: string | null = null;
  /** Indica si el juego ha terminado */
  private _gameOver = false;

  /** Jugador asignado al símbolo X */
  private _playerX: Player | null = null;
  /** Jugador asignado al símbolo O */
  private _playerO: Player | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // ===== GETTERS =====

  /** Estado actual del tablero (array de 9 strings) */
  get board(): string[] {
    return this._board;
  }

  /** Símbolo del jugador con el turno actual */
  get currentTurn(): string {
    return this._currentTurn;
  }

  /** Ganador del juego o null si continúa */
  get winner(): string | null {
    return this._winner;
  }

  /** Indica si el juego ha terminado */
  get gameOver(): boolean {
    return this._gameOver;
  }

  /** Jugador X o null si no está asignado */
  get playerX(): Player | null {
    return this._playerX;
  }

  /** Jugador O o null si no está asignado */
  get playerO(): Player | null {
    return this._playerO;
  }

  /** Indica si falta algún jugador para comenzar */
  get waitingForPlayer(): boolean {
    return this._playerX === null || this._playerO === null;
  }

  // ===== JUGADORES =====

  /**
   * Asigna un jugador a su símbolo correspondiente.
   * 
   * @param player - Jugador a asignar (debe tener símbolo 'X' o 'O')
   */
  assignPlayer(player: Player): void {
    if (player.symbol === 'X') {
      this._playerX = player;
    } else if (player.symbol === 'O') {
      this._playerO = player;
    }
  }

  /**
   * Elimina un jugador por su símbolo.
   * 
   * @param symbol - Símbolo del jugador a eliminar ('X' o 'O')
   */
  removePlayer(symbol: string): void {
    if (symbol === 'X') {
      this._playerX = null;
    } else if (symbol === 'O') {
      this._playerO = null;
    }
  }

  /**
   * Elimina ambos jugadores del estado.
   */
  clearPlayers(): void {
    this._playerX = null;
    this._playerO = null;
  }

  // ===== JUEGO =====

  /**
   * Realiza un movimiento en el tablero.
   * Valida todas las condiciones antes de aplicar el movimiento.
   * 
   * @param position - Índice de la celda (0-8)
   * @param symbol - Símbolo del jugador que hace el movimiento
   * @returns true si el movimiento fue válido y aplicado, false en caso contrario
   */
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

  /**
   * Reinicia el estado del juego a valores iniciales.
   * Mantiene los jugadores asignados.
   */
  reset(): void {
    this._board = Array(9).fill('');
    this._currentTurn = 'X';
    this._winner = null;
    this._gameOver = false;
  }

  /**
   * Verifica si una celda está vacía.
   * 
   * @param position - Índice de la celda (0-8)
   * @returns true si la celda está vacía, false si está ocupada o posición inválida
   */
  isCellEmpty(position: number): boolean {
    let empty = false;

    if (position >= 0 && position <= 8) {
      empty = this._board[position] === '';
    }

    return empty;
  }

  // ===== LÓGICA INTERNA =====

  /**
   * Verifica el resultado del juego tras un movimiento.
   * Actualiza _winner y _gameOver si hay victoria o empate.
   */
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

  /**
   * Verifica si hay un ganador en el tablero actual.
   * Comprueba las 8 líneas ganadoras posibles.
   * 
   * @returns Símbolo del ganador ('X' o 'O') o null si no hay ganador
   */
  private checkWinner(): string | null {
    let result: string | null = null;

    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6],            // Diagonales
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