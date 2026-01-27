/**
 * DOMAIN LAYER - Casos de Uso del Juego
 * 
 * Implementa la lógica de negocio para gestionar el juego
 * Recibe la conexión SignalR inyectada desde la capa de datos
 */

import { injectable, inject } from 'inversify';
import { GameState } from '../entities/GameState';
import { IGameUseCases } from '../interfaces/IGameUseCases';
import { ISignalRConnection } from '../../data/SignalRConnection'; // ← Import correcto
import { TYPES } from '../../core/types';

/**
 * Implementación de casos de uso para el juego
 * @injectable - Marca la clase como inyectable por InversifyJS
 */
@injectable()
export class GameUseCases implements IGameUseCases {
  private connection: ISignalRConnection;

  /**
   * Constructor con inyección de dependencias
   * @inject - Inyecta la conexión SignalR desde la capa de datos
   */
  constructor(
    @inject(TYPES.ISignalRConnection) connection: ISignalRConnection
  ) {
    this.connection = connection;
    console.log('🔧 GameUseCases creado con conexión inyectada');
  }

  /**
   * Inicializa la conexión con SignalR
   */
  async initializeConnection(): Promise<void> {
    try {
      console.log('🚀 Inicializando conexión...');
      await this.connection.start();
      console.log('✅ Conexión inicializada en GameUseCases');
    } catch (error: any) {
      console.error('❌ Error al inicializar conexión:', error);
      throw new Error(`Error de conexión: ${error.message}`);
    }
  }

  /**
   * Realiza un movimiento en el tablero
   */
  async makeMove(position: number): Promise<void> {
    if (!this.connection.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    if (position < 0 || position > 8) {
      throw new Error('Posición inválida');
    }

    try {
      console.log('📤 Enviando movimiento:', position);
      await this.connection.invoke('MakeMove', position);
      console.log('✅ Movimiento enviado');
    } catch (error: any) {
      console.error('❌ Error al enviar movimiento:', error);
      throw new Error(`Error al realizar movimiento: ${error.message}`);
    }
  }

  /**
   * Reinicia el juego
   */
  async resetGame(): Promise<void> {
    if (!this.connection.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    try {
      console.log('🔄 Reiniciando juego...');
      await this.connection.invoke('ResetGame');
      console.log('✅ Juego reiniciado');
    } catch (error: any) {
      console.error('❌ Error al reiniciar:', error);
      throw new Error(`Error al reiniciar: ${error.message}`);
    }
  }

  /**
   * Solicita el estado actual del juego
   */
  async getGameState(): Promise<void> {
    if (!this.connection.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    try {
      console.log('📥 Solicitando estado del juego...');
      await this.connection.invoke('GetGameState');
      console.log('✅ Estado solicitado');
    } catch (error: any) {
      console.error('❌ Error al solicitar estado:', error);
      throw new Error(`Error al obtener estado: ${error.message}`);
    }
  }

  /**
   * Registra un callback para recibir actualizaciones del estado
   */
  onGameStateUpdated(callback: (gameState: GameState) => void): void {
    console.log('👂 Registrando listener para GameStateUpdated...');

    this.connection.on('GameStateUpdated', (gameStateJSON: any) => {
      console.log('📩 Estado del juego recibido (raw):', JSON.stringify(gameStateJSON));
      
      try {
        const gameState = GameState.fromJSON(gameStateJSON);
        console.log('✅ Estado parseado:', {
          currentTurn: gameState.currentTurn,
          winner: gameState.winner,
          gameOver: gameState.gameOver,
          waitingForPlayer: gameState.waitingForPlayer
        });
        callback(gameState);
      } catch (error) {
        console.error('❌ Error parseando estado:', error);
      }
    });

    console.log('✅ Listener registrado');
  }

  /**
   * Cierra la conexión con el servidor
   */
  async disconnect(): Promise<void> {
    console.log('🔌 Desconectando...');
    await this.connection.stop();
    console.log('✅ Desconectado');
  }

  /**
   * Verifica si hay conexión activa
   */
  isConnected(): boolean {
    return this.connection.isConnected();
  }

  /**
   * Obtiene el ID de conexión actual
   */
  getConnectionId(): string | null {
    return this.connection.getConnectionId();
  }
}