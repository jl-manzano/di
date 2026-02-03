import { inject, injectable } from 'inversify';
import { TYPES } from '../core/types';

import { SignalRConnection } from '../data/SignalRConnection';
import {
    GameResetEvent,
    IGameRepository,
    MoveMadeEvent,
    PlayerJoinedEvent,
    Unsubscribe
} from '../domain/interfaces/IGameRepository';

@injectable()
export class SignalRGameRepository implements IGameRepository {
  // handlers
  private playerJoinedHandlers: Array<(e: PlayerJoinedEvent) => void> = [];
  private moveMadeHandlers: Array<(e: MoveMadeEvent) => void> = [];
  private gameResetHandlers: Array<(e: GameResetEvent) => void> = [];
  private opponentDisconnectedHandlers: Array<() => void> = [];
  private opponentLeftHandlers: Array<() => void> = [];

  private bound = {
    PlayerJoined: (data: any) => {
      const ev: PlayerJoinedEvent = {
        connectionId: data.connectionId || data.ConnectionId || '',
        symbol: data.symbol || data.Symbol || '',
        playerName: data.playerName || data.PlayerName || 'Jugador',
        playerCount: data.playerCount || data.PlayerCount || 0,
      };
      this.playerJoinedHandlers.forEach((h) => h(ev));
    },
    MoveBroadcasted: (data: any) => {
      const ev: MoveMadeEvent = {
        connectionId: data.connectionId || data.ConnectionId || '',
        position: data.position || data.Position || 0,
      };
      this.moveMadeHandlers.forEach((h) => h(ev));
    },
    ResetBroadcasted: (data: any) => {
      const ev: GameResetEvent = {
        connectionId: data.connectionId || data.ConnectionId || '',
      };
      this.gameResetHandlers.forEach((h) => h(ev));
    },
    OpponentDisconnected: () => {
      this.opponentDisconnectedHandlers.forEach((h) => h());
    },
    OpponentLeft: () => {
      this.opponentLeftHandlers.forEach((h) => h());
    },
  };

  constructor(
    @inject(TYPES.SignalRConnection) private readonly conn: SignalRConnection
  ) {}

  async connect(): Promise<void> {
    await this.conn.connect();

    this.conn.on('PlayerJoined', this.bound.PlayerJoined);
    this.conn.on('MoveBroadcasted', this.bound.MoveBroadcasted);
    this.conn.on('ResetBroadcasted', this.bound.ResetBroadcasted);
    this.conn.on('OpponentDisconnected', this.bound.OpponentDisconnected);
    this.conn.on('OpponentLeft', this.bound.OpponentLeft);
  }

  async disconnect(): Promise<void> {
    if (this.conn.isConnected()) {
      this.conn.off('PlayerJoined', this.bound.PlayerJoined);
      this.conn.off('MoveBroadcasted', this.bound.MoveBroadcasted);
      this.conn.off('ResetBroadcasted', this.bound.ResetBroadcasted);
      this.conn.off('OpponentDisconnected', this.bound.OpponentDisconnected);
      this.conn.off('OpponentLeft', this.bound.OpponentLeft);
    }

    await this.conn.disconnect();
  }

  isConnected(): boolean {
    return this.conn.isConnected();
  }

  getConnectionId(): string | null {
    return this.conn.getConnectionId();
  }

  async sendMove(position: number): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');
    if (position < 0 || position > 8) throw new Error('Posición inválida');

    await this.conn.invoke('BroadcastMove', position);
  }

  async sendReset(): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');
    await this.conn.invoke('BroadcastReset');
  }

  onPlayerJoined(handler: (e: PlayerJoinedEvent) => void): Unsubscribe {
    this.playerJoinedHandlers.push(handler);
    return () => (this.playerJoinedHandlers = this.playerJoinedHandlers.filter((h) => h !== handler));
  }

  onMoveMade(handler: (e: MoveMadeEvent) => void): Unsubscribe {
    this.moveMadeHandlers.push(handler);
    return () => (this.moveMadeHandlers = this.moveMadeHandlers.filter((h) => h !== handler));
  }

  onGameReset(handler: (e: GameResetEvent) => void): Unsubscribe {
    this.gameResetHandlers.push(handler);
    return () => (this.gameResetHandlers = this.gameResetHandlers.filter((h) => h !== handler));
  }

  onOpponentDisconnected(handler: () => void): Unsubscribe {
    this.opponentDisconnectedHandlers.push(handler);
    return () =>
      (this.opponentDisconnectedHandlers = this.opponentDisconnectedHandlers.filter((h) => h !== handler));
  }

  onOpponentLeft(handler: () => void): Unsubscribe {
    this.opponentLeftHandlers.push(handler);
    return () => (this.opponentLeftHandlers = this.opponentLeftHandlers.filter((h) => h !== handler));
  }
}
