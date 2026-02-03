import { inject, injectable } from 'inversify';
import { TYPES } from '../core/types';

import { SignalRConnection } from '../data/SignalRConnection';
import { Room } from '../domain/entities/Room';
import { Unsubscribe } from '../domain/interfaces/IGameRepository';
import { IRoomRepository } from '../domain/interfaces/IRoomRepository';

@injectable()
export class SignalRRoomRepository implements IRoomRepository {
  private roomListHandlers: Array<(rooms: Room[]) => void> = [];
  private roomListListenerAttached = false;

  private boundRoomListUpdated = (rooms: any[]) => {
    const mapped: Room[] = (rooms ?? []).map((r: any) => Room.fromJSON(r));
    this.roomListHandlers.forEach((h) => h(mapped));
  };

  constructor(
    @inject(TYPES.SignalRConnection) private readonly conn: SignalRConnection
  ) {}

  private ensureListener(): void {
    if (this.roomListListenerAttached) return;
    this.conn.on('RoomListUpdated', this.boundRoomListUpdated);
    this.roomListListenerAttached = true;
  }

  async createRoom(roomName: string): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');
    await this.conn.invoke('CreateRoom', roomName);
  }

  async joinRoom(roomId: string, playerName?: string): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');
    await this.conn.invoke('JoinRoom', roomId, playerName ?? 'Jugador');
  }

  async leaveRoom(): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');
    await this.conn.invoke('LeaveRoom');
  }

  async requestRoomList(): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');

    this.ensureListener();

    await this.conn.invoke('GetRoomList');
  }

  onRoomListUpdated(handler: (rooms: Room[]) => void): Unsubscribe {
    this.roomListHandlers.push(handler);
    return () => {
      this.roomListHandlers = this.roomListHandlers.filter((h) => h !== handler);
    };
  }
}
