import { GameState } from '../entities/GameState';

export interface IGameUseCases {
  makeMove(
    position: number,
    gameState: GameState,
    mySymbol: string | null
  ): Promise<{ success: boolean; position: number; error?: string }>;

  resetGame(): Promise<void>;

  createRoom(roomName: string): Promise<void>;
  joinRoom(roomId: string, playerName?: string): Promise<void>;
  leaveRoom(): Promise<void>;
  getRoomList(): Promise<void>;
}
