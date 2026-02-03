export interface PlayerJoinedEvent {
  connectionId: string;
  symbol: string;
  playerName: string;
  playerCount: number;
}

export interface MoveMadeEvent {
  connectionId: string;
  position: number;
}

export interface GameResetEvent {
  connectionId: string;
}

export type Unsubscribe = () => void;

export interface IGameRepository {
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  isConnected(): boolean;
  getConnectionId(): string | null;

  sendMove(position: number): Promise<void>;
  sendReset(): Promise<void>;

  onPlayerJoined(handler: (e: PlayerJoinedEvent) => void): Unsubscribe;
  onMoveMade(handler: (e: MoveMadeEvent) => void): Unsubscribe;
  onGameReset(handler: (e: GameResetEvent) => void): Unsubscribe;
  onOpponentDisconnected(handler: () => void): Unsubscribe;
  onOpponentLeft(handler: () => void): Unsubscribe;
}
