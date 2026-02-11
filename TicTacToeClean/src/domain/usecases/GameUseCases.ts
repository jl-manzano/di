/**
 * @file GameUseCases.ts
 * @summary Implementación de los casos de uso del juego Tic Tac Toe.
 * 
 * Esta clase implementa la capa de aplicación (Application Layer) en
 * Clean Architecture. Orquesta las operaciones de negocio coordinando
 * entre los repositorios y validando las reglas de negocio.
 * 
 * Responsabilidades:
 * - Validar precondiciones antes de ejecutar operaciones
 * - Coordinar entre repositorios de juego y salas
 * - Manejar errores y proporcionar mensajes descriptivos
 * - Aplicar reglas de negocio (longitud de nombres, turnos, etc.)
 */

import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/types';

import { GameState } from '../entities/GameState';
import { IGameRepository } from '../interfaces/IGameRepository';
import { IGameUseCases } from '../interfaces/IGameUseCases';
import { IRoomRepository } from '../interfaces/IRoomRepository';

@injectable()
export class GameUseCases implements IGameUseCases {
  /**
   * Crea una nueva instancia de GameUseCases.
   * 
   * @param gameRepo - Repositorio para operaciones del juego
   * @param roomRepo - Repositorio para operaciones de salas
   */
  constructor(
    @inject(TYPES.IGameRepository) private readonly gameRepo: IGameRepository,
    @inject(TYPES.IRoomRepository) private readonly roomRepo: IRoomRepository
  ) {}

  /**
   * Realiza un movimiento en el tablero con validación completa.
   * 
   * Validaciones realizadas:
   * - Jugador tiene símbolo asignado
   * - Posición válida (0-8)
   * - Celda está vacía
   * - Juego no ha terminado
   * - No está esperando segundo jugador
   * - Es el turno del jugador
   * 
   * @param position - Posición del tablero (0-8)
   * @param gameState - Estado actual del juego
   * @param mySymbol - Símbolo del jugador que hace el movimiento
   * @returns Objeto con resultado de la operación
   */
  async makeMove(
    position: number,
    gameState: GameState,
    mySymbol: string | null
  ): Promise<{ success: boolean; position: number; error?: string }> {

    let success = true;
    let error: string | undefined;

    if (!mySymbol) {
      success = false;
      error = 'No tienes un símbolo asignado';
    } else if (position < 0 || position > 8) {
      success = false;
      error = 'Posición inválida';
    } else if (!gameState.isCellEmpty(position)) {
      success = false;
      error = 'La celda ya está ocupada';
    } else if (gameState.gameOver) {
      success = false;
      error = 'El juego ya terminó';
    } else if (gameState.waitingForPlayer) {
      success = false;
      error = 'Esperando al segundo jugador';
    } else if (gameState.currentTurn !== mySymbol) {
      success = false;
      error = 'No es tu turno';
    }

    if (success) {
      try {
        await this.gameRepo.sendMove(position);
      } catch (err: any) {
        success = false;
        error = err?.message ?? 'Error desconocido';
      }
    }

    return { success, position, error };
  }

  /**
   * Reinicia el juego actual.
   * 
   * @throws Error si no hay conexión con el servidor
   */
  async resetGame(): Promise<void> {
    if (!this.gameRepo.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    await this.gameRepo.sendReset();
  }

  /**
   * Crea una nueva sala de juego con validación del nombre.
   * 
   * @param roomName - Nombre de la sala (3-30 caracteres)
   * @throws Error si el nombre no cumple las validaciones
   */
  async createRoom(roomName: string): Promise<void> {
    if (!roomName || !roomName.trim()) {
      throw new Error('El nombre de la sala no puede estar vacío');
    }

    const trimmed = roomName.trim();

    if (trimmed.length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }

    if (trimmed.length > 30) {
      throw new Error('El nombre no puede exceder 30 caracteres');
    }

    await this.roomRepo.createRoom(trimmed);
  }

  /**
   * Une al jugador a una sala existente.
   * 
   * @param roomId - ID de la sala
   * @param playerName - Nombre del jugador (default: 'Jugador')
   * @throws Error si el roomId está vacío
   */
  async joinRoom(roomId: string, playerName = 'Jugador'): Promise<void> {
    if (!roomId || !roomId.trim()) {
      throw new Error('El ID de la sala no puede estar vacío');
    }

    await this.roomRepo.joinRoom(roomId.trim(), playerName);
  }

  /**
   * Abandona la sala actual del jugador.
   */
  async leaveRoom(): Promise<void> {
    await this.roomRepo.leaveRoom();
  }

  /**
   * Solicita la lista actualizada de salas disponibles.
   */
  async getRoomList(): Promise<void> {
    await this.roomRepo.requestRoomList();
  }
}