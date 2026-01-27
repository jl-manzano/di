/**
 * DOMAIN LAYER - Interfaz de Casos de Uso del Juego
 * 
 * Define el contrato para los casos de uso del Tres en Raya
 * Principio de Inversión de Dependencias (SOLID)
 */
import { GameState } from '../entities/GameState';

export interface IGameUseCases {
  /**
   * Inicializa la conexión con el servidor
   */
  initializeConnection(): Promise<void>;

  /**
   * Realiza un movimiento en el tablero
   */
  makeMove(position: number): Promise<void>;

  /**
   * Reinicia el juego
   */
  resetGame(): Promise<void>;

  /**
   * Solicita el estado actual del juego
   */
  getGameState(): Promise<void>;

  /**
   * Suscribe un callback para recibir actualizaciones del estado
   */
  onGameStateUpdated(callback: (gameState: GameState) => void): void;

  /**
   * Desconecta del servidor
   */
  disconnect(): Promise<void>;

  /**
   * Verifica si está conectado
   */
  isConnected(): boolean;
}