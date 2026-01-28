import { GameState } from '../entities/GameState';
import { Room } from '../entities/Room';

export interface IGameUseCases {
  initializeConnection(): Promise<void>;
  makeMove(position: number): Promise<void>;
  resetGame(): Promise<void>;
  getGameState(): Promise<void>;
  onGameStateUpdated(callback: (gameState: GameState) => void): void;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getConnectionId(): string | null;
  
  // Métodos para salas
  createRoom(roomName: string): Promise<void>;
  joinRoom(roomId: string, playerName?: string): Promise<void>;
  leaveRoom(): Promise<void>; // ✅ NUEVO
  getRoomList(): Promise<void>;
  onRoomListUpdated(callback: (rooms: Room[]) => void): void;
}