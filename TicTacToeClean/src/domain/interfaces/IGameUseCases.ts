/**
 * DOMAIN LAYER - Interfaz de casos de uso
 * Define las operaciones disponibles para el juego
 */
import { Room } from '../entities/Room';

export interface IGameUseCases {
  // ========== CONEXIÓN ==========
  
  /**
   * Inicializa la conexión con el servidor
   */
  initializeConnection(): Promise<void>;
  
  /**
   * Desconecta del servidor
   */
  disconnect(): Promise<void>;
  
  /**
   * Verifica si está conectado
   */
  isConnected(): boolean;
  
  /**
   * Obtiene el ID de conexión actual
   */
  getConnectionId(): string | null;

  // ========== BROADCAST DE MOVIMIENTOS ==========
  
  /**
   * Retransmite un movimiento al oponente
   * NO espera validación del servidor
   */
  broadcastMove(position: number): Promise<void>;
  
  /**
   * Retransmite solicitud de reinicio
   */
  broadcastReset(): Promise<void>;

  // ========== LISTENERS PARA EVENTOS DEL SERVIDOR ==========
  
  /**
   * Escucha cuando otro jugador hace un movimiento
   */
  onMoveBroadcasted(callback: (data: { connectionId: string; position: number }) => void): void;
  
  /**
   * Escucha cuando otro jugador solicita reinicio
   */
  onResetBroadcasted(callback: (data: { connectionId: string }) => void): void;
  
  /**
   * Escucha cuando un jugador se une a la sala
   */
  onPlayerJoined(callback: (data: { 
    connectionId: string; 
    symbol: string; 
    playerName: string; 
    playerCount: number 
  }) => void): void;
  
  /**
   * Escucha cuando el oponente se desconecta
   */
  onOpponentDisconnected(callback: () => void): void;
  
  /**
   * Escucha cuando el oponente abandona la sala
   */
  onOpponentLeft(callback: () => void): void;

  // ========== GESTIÓN DE SALAS ==========
  
  /**
   * Crea una nueva sala de juego
   */
  createRoom(roomName: string): Promise<void>;
  
  /**
   * Se une a una sala existente
   */
  joinRoom(roomId: string, playerName?: string): Promise<void>;
  
  /**
   * Sale de la sala actual
   */
  leaveRoom(): Promise<void>;
  
  /**
   * Solicita la lista de salas disponibles
   */
  getRoomList(): Promise<void>;
  
  /**
   * Escucha actualizaciones de la lista de salas
   */
  onRoomListUpdated(callback: (rooms: Room[]) => void): void;
}