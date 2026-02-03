import { Room } from '../entities/Room';
import { Unsubscribe } from './IGameRepository';

export interface IRoomRepository {
  createRoom(roomName: string): Promise<void>;
  joinRoom(roomId: string, playerName?: string): Promise<void>;
  leaveRoom(): Promise<void>;
  requestRoomList(): Promise<void>;

  onRoomListUpdated(handler: (rooms: Room[]) => void): Unsubscribe;
}
