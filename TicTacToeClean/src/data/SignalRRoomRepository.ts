/**
 * @file SignalRRoomRepository.ts
 * @summary Repositorio para gestión de salas de juego vía SignalR.
 * 
 * Implementa la interfaz IRoomRepository utilizando SignalR como
 * mecanismo de comunicación. Gestiona todas las operaciones relacionadas
 * con salas: creación, unión, abandono y listado.
 * 
 * Responsabilidades:
 * - Crear nuevas salas de juego en el servidor
 * - Permitir a jugadores unirse a salas existentes
 * - Gestionar el abandono de salas
 * - Solicitar y recibir actualizaciones de la lista de salas
 * - Notificar cambios en la lista de salas a los suscriptores
 */

import { inject, injectable } from 'inversify';
import { TYPES } from '../core/types';

import { SignalRConnection } from '../data/SignalRConnection';
import { Room } from '../domain/entities/Room';
import { Unsubscribe } from '../domain/interfaces/IGameRepository';
import { IRoomRepository } from '../domain/interfaces/IRoomRepository';

@injectable()
export class SignalRRoomRepository implements IRoomRepository {
  /** Lista de handlers suscritos a actualizaciones de salas */
  private roomListHandlers: Array<(rooms: Room[]) => void> = [];
  /** Flag para evitar registrar múltiples listeners del mismo evento */
  private roomListListenerAttached = false;

  /** Handler bound para el evento RoomListUpdated del servidor */
  private boundRoomListUpdated = (rooms: any[]) => {
    const mapped: Room[] = (rooms ?? []).map((r: any) => Room.fromJSON(r));
    this.roomListHandlers.forEach((h) => h(mapped));
  };

  /**
   * Crea una nueva instancia del repositorio de salas.
   * 
   * @param conn - Conexión SignalR compartida inyectada
   */
  constructor(
    @inject(TYPES.SignalRConnection) private readonly conn: SignalRConnection
  ) {}

  /**
   * Asegura que el listener de actualizaciones de salas esté registrado.
   * Solo registra una vez para evitar duplicados.
   */
  private ensureListener(): void {
    if (this.roomListListenerAttached) return;
    this.conn.on('RoomListUpdated', this.boundRoomListUpdated);
    this.roomListListenerAttached = true;
  }

  /**
   * Crea una nueva sala de juego en el servidor.
   * 
   * @param roomName - Nombre para la nueva sala
   * @throws Error si no hay conexión activa
   */
  async createRoom(roomName: string): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');
    await this.conn.invoke('CreateRoom', roomName);
  }

  /**
   * Une al jugador actual a una sala existente.
   * 
   * @param roomId - ID único de la sala
   * @param playerName - Nombre del jugador (opcional, default: 'Jugador')
   * @throws Error si no hay conexión activa
   */
  async joinRoom(roomId: string, playerName?: string): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');
    await this.conn.invoke('JoinRoom', roomId, playerName ?? 'Jugador');
  }

  /**
   * Abandona la sala actual.
   * 
   * @throws Error si no hay conexión activa
   */
  async leaveRoom(): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');
    await this.conn.invoke('LeaveRoom');
  }

  /**
   * Solicita al servidor la lista actualizada de salas disponibles.
   * El servidor responderá con el evento RoomListUpdated.
   * 
   * @throws Error si no hay conexión activa
   */
  async requestRoomList(): Promise<void> {
    if (!this.conn.isConnected()) throw new Error('No hay conexión activa con el servidor');

    this.ensureListener();

    await this.conn.invoke('GetRoomList');
  }

  /**
   * Suscribe un handler para recibir actualizaciones de la lista de salas.
   * 
   * @param handler - Función que recibe el array actualizado de salas
   * @returns Función para cancelar la suscripción
   */
  onRoomListUpdated(handler: (rooms: Room[]) => void): Unsubscribe {
    this.roomListHandlers.push(handler);
    return () => {
      this.roomListHandlers = this.roomListHandlers.filter((h) => h !== handler);
    };
  }
}