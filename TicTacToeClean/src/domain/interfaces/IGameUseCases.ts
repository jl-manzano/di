/**
 * @file IGameUseCases.ts
 * @summary Interfaz que define los casos de uso del juego.
 * 
 * Representa la capa de aplicación en Clean Architecture,
 * definiendo todas las operaciones que un usuario puede realizar
 * en el sistema. Actúa como punto de entrada para la lógica de negocio.
 * 
 * Casos de uso incluidos:
 * - makeMove: Realizar un movimiento en el tablero
 * - resetGame: Reiniciar la partida actual
 * - createRoom: Crear una nueva sala de juego
 * - joinRoom: Unirse a una sala existente
 * - leaveRoom: Abandonar la sala actual
 * - getRoomList: Obtener lista de salas disponibles
 */

import { GameState } from '../entities/GameState';

export interface IGameUseCases {
  /**
   * Realiza un movimiento en el tablero.
   * Valida el estado del juego y permisos antes de enviar al servidor.
   * 
   * @param position - Posición del tablero (0-8)
   * @param gameState - Estado actual del juego
   * @param mySymbol - Símbolo del jugador local
   * @returns Resultado con éxito/fallo y posible mensaje de error
   */
  makeMove(
    position: number,
    gameState: GameState,
    mySymbol: string | null
  ): Promise<{ success: boolean; position: number; error?: string }>;

  /**
   * Reinicia el juego actual.
   * Envía la solicitud al servidor para ambos jugadores.
   */
  resetGame(): Promise<void>;

  /**
   * Crea una nueva sala de juego.
   * 
   * @param roomName - Nombre para la sala (3-30 caracteres)
   */
  createRoom(roomName: string): Promise<void>;

  /**
   * Une al jugador a una sala existente.
   * 
   * @param roomId - ID de la sala a unirse
   * @param playerName - Nombre del jugador (opcional)
   */
  joinRoom(roomId: string, playerName?: string): Promise<void>;

  /**
   * Abandona la sala actual.
   */
  leaveRoom(): Promise<void>;

  /**
   * Solicita la lista actualizada de salas.
   */
  getRoomList(): Promise<void>;
}