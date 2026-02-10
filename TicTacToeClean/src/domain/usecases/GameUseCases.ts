import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/types';

import { GameState } from '../entities/GameState';
import { IGameRepository } from '../interfaces/IGameRepository';
import { IGameUseCases } from '../interfaces/IGameUseCases';
import { IRoomRepository } from '../interfaces/IRoomRepository';

@injectable()
export class GameUseCases implements IGameUseCases {
  constructor(
    @inject(TYPES.IGameRepository) private readonly gameRepo: IGameRepository,
    @inject(TYPES.IRoomRepository) private readonly roomRepo: IRoomRepository
  ) {}

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

  async resetGame(): Promise<void> {
    if (!this.gameRepo.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    await this.gameRepo.sendReset();
  }

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

  async joinRoom(roomId: string, playerName = 'Jugador'): Promise<void> {
    if (!roomId || !roomId.trim()) {
      throw new Error('El ID de la sala no puede estar vacío');
    }

    await this.roomRepo.joinRoom(roomId.trim(), playerName);
  }

  async leaveRoom(): Promise<void> {
    await this.roomRepo.leaveRoom();
  }

  async getRoomList(): Promise<void> {
    await this.roomRepo.requestRoomList();
  }
}