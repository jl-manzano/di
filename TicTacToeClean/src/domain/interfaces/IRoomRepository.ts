/**
 * @file IRoomRepository.ts
 * @summary Interfaz del repositorio para gestión de salas de juego.
 * 
 * Define el contrato para todas las operaciones relacionadas con salas:
 * creación, unión, abandono y consulta. Permite desacoplar la lógica
 * de dominio de la implementación específica de comunicación.
 * 
 * Operaciones soportadas:
 * - createRoom: Crear nueva sala
 * - joinRoom: Unirse a sala existente
 * - leaveRoom: Abandonar sala actual
 * - requestRoomList: Solicitar lista de salas
 * - onRoomListUpdated: Suscribirse a actualizaciones
 */

import { Room } from '../entities/Room';
import { Unsubscribe } from './IGameRepository';

export interface IRoomRepository {
  /**
   * Crea una nueva sala de juego en el servidor.
   * 
   * @param roomName - Nombre para la nueva sala
   */
  createRoom(roomName: string): Promise<void>;

  /**
   * Une al jugador actual a una sala existente.
   * 
   * @param roomId - ID único de la sala
   * @param playerName - Nombre del jugador (opcional)
   */
  joinRoom(roomId: string, playerName?: string): Promise<void>;

  /**
   * Abandona la sala en la que está el jugador.
   */
  leaveRoom(): Promise<void>;

  /**
   * Solicita al servidor la lista actualizada de salas.
   */
  requestRoomList(): Promise<void>;

  /**
   * Suscribe un handler para recibir actualizaciones de la lista de salas.
   * 
   * @param handler - Callback que recibe el array de salas
   * @returns Función para cancelar la suscripción
   */
  onRoomListUpdated(handler: (rooms: Room[]) => void): Unsubscribe;
}