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

    if (!mySymbol) return { success: false, position, error: 'No tienes un símbolo asignado' };
    if (position < 0 || position > 8) return { success: false, position, error: 'Posición inválida' };
    if (!gameState.isCellEmpty(position)) return { success: false, position, error: 'La celda ya está ocupada' };
    if (gameState.gameOver) return { success: false, position, error: 'El juego ya terminó' };
    if (gameState.waitingForPlayer) return { success: false, position, error: 'Esperando al segundo jugador' };
    if (gameState.currentTurn !== mySymbol) return { success: false, position, error: 'No es tu turno' };

    try {
      await this.gameRepo.sendMove(position);
      return { success: true, position };
    } catch (error: any) {
      return { success: false, position, error: error?.message ?? 'Error desconocido' };
    }
  }

  async resetGame(): Promise<void> {
    if (!this.gameRepo.isConnected()) throw new Error('No hay conexión con el servidor');
    await this.gameRepo.sendReset();
  }

  async createRoom(roomName: string): Promise<void> {
    if (!roomName || !roomName.trim()) throw new Error('El nombre de la sala no puede estar vacío');

    const trimmed = roomName.trim();
    if (trimmed.length < 3) throw new Error('El nombre debe tener al menos 3 caracteres');
    if (trimmed.length > 30) throw new Error('El nombre no puede exceder 30 caracteres');

    await this.roomRepo.createRoom(trimmed);
  }

  async joinRoom(roomId: string, playerName: string = 'Jugador'): Promise<void> {
    if (!roomId || !roomId.trim()) throw new Error('El ID de la sala no puede estar vacío');
    await this.roomRepo.joinRoom(roomId.trim(), playerName);
  }

  async leaveRoom(): Promise<void> {
    await this.roomRepo.leaveRoom();
  }

  async getRoomList(): Promise<void> {
    await this.roomRepo.requestRoomList();
  }
}
