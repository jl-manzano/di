/**
 * @file IGameRepository.ts
 * @summary Interfaz del repositorio de juego para comunicación con el servidor.
 * 
 * Define el contrato para todas las operaciones relacionadas con la lógica
 * del juego en tiempo real: conexión, movimientos, reset y eventos del servidor.
 * Permite desacoplar la lógica de dominio de la implementación específica
 * de comunicación (SignalR, WebSocket, etc.).
 * 
 * Eventos soportados:
 * - PlayerJoined: Un jugador se unió a la partida
 * - MoveMade: Se realizó un movimiento en el tablero
 * - GameReset: El juego fue reiniciado
 * - OpponentDisconnected: El oponente perdió conexión
 * - OpponentLeft: El oponente abandonó la sala
 */

/** Datos del evento cuando un jugador se une */
export interface PlayerJoinedEvent {
  /** ID de conexión del jugador que se unió */
  connectionId: string;
  /** Símbolo asignado al jugador ('X' o 'O') */
  symbol: string;
  /** Nombre del jugador */
  playerName: string;
  /** Cantidad total de jugadores en la sala */
  playerCount: number;
}

/** Datos del evento cuando se realiza un movimiento */
export interface MoveMadeEvent {
  /** ID de conexión del jugador que hizo el movimiento */
  connectionId: string;
  /** Posición del tablero donde se hizo el movimiento (0-8) */
  position: number;
}

/** Datos del evento cuando se reinicia el juego */
export interface GameResetEvent {
  /** ID de conexión del jugador que solicitó el reset */
  connectionId: string;
}

/** Función para cancelar una suscripción a eventos */
export type Unsubscribe = () => void;

/**
 * Contrato para el repositorio de operaciones de juego.
 * Abstrae la comunicación con el servidor para movimientos y eventos del juego.
 */
export interface IGameRepository {
  /** Establece la conexión con el servidor */
  connect(): Promise<void>;
  /** Cierra la conexión con el servidor */
  disconnect(): Promise<void>;

  /** Verifica si hay conexión activa */
  isConnected(): boolean;
  /** Obtiene el ID de conexión actual */
  getConnectionId(): string | null;

  /** Envía un movimiento al servidor */
  sendMove(position: number): Promise<void>;
  /** Envía solicitud de reinicio al servidor */
  sendReset(): Promise<void>;

  /** Suscribe a eventos de jugador unido */
  onPlayerJoined(handler: (e: PlayerJoinedEvent) => void): Unsubscribe;
  /** Suscribe a eventos de movimiento realizado */
  onMoveMade(handler: (e: MoveMadeEvent) => void): Unsubscribe;
  /** Suscribe a eventos de juego reiniciado */
  onGameReset(handler: (e: GameResetEvent) => void): Unsubscribe;
  /** Suscribe a eventos de oponente desconectado */
  onOpponentDisconnected(handler: () => void): Unsubscribe;
  /** Suscribe a eventos de oponente que abandonó */
  onOpponentLeft(handler: () => void): Unsubscribe;
}