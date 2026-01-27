/**
 * UI LAYER - ViewModel para el Juego
 * 
 * Gestiona el estado y la lógica de presentación del juego
 * Patrón MVVM con MobX para reactividad
 */

import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { GameState } from '../../domain/entities/GameState';
import { Player } from '../../domain/entities/Player';
import { IGameUseCases } from '../../domain/interfaces/IGameUseCases';
import { TYPES } from '../../core/types';

/**
 * ViewModel del Juego
 * @injectable - Marca la clase como inyectable por InversifyJS
 */
@injectable()
export class GameViewModel {
  // Estado observable con MobX
  gameState: GameState = new GameState();
  isConnected: boolean = false;
  errorMessage: string = '';
  mySymbol: string = ''; // "X", "O", o "" si es espectador

  private gameUseCases: IGameUseCases;

  /**
   * Constructor con inyección de dependencias
   * @inject - Inyecta IGameUseCases desde el contenedor
   */
  constructor(
    @inject(TYPES.IGameUseCases) gameUseCases: IGameUseCases
  ) {
    this.gameUseCases = gameUseCases;
    makeAutoObservable(this);
    console.log('🎯 GameViewModel inicializado con InversifyJS');
  }

  /**
   * Inicializa la conexión y configura listeners
   */
  async initialize(): Promise<void> {
    console.log('🚀 Iniciando conexión desde ViewModel...');
    try {
      await this.gameUseCases.initializeConnection();
      
      runInAction(() => {
        this.isConnected = true;
        this.errorMessage = '';
        console.log('✅ ViewModel: Conexión establecida');
      });

      // Configurar listener para actualizaciones del estado
      this.gameUseCases.onGameStateUpdated((gameState: GameState) => {
        console.log('📩 ViewModel recibió actualización del estado');
        this.updateGameState(gameState);
      });

      // Solicitar estado inicial
      await this.gameUseCases.getGameState();
    } catch (error: any) {
      console.error('❌ ViewModel: Error al conectar:', error);
      runInAction(() => {
        this.isConnected = false;
        this.errorMessage = error.message || 'Error al conectar con el servidor';
      });
    }
  }

  /**
   * Actualiza el estado del juego
   */
  private updateGameState(gameState: GameState): void {
    runInAction(() => {
      this.gameState = gameState;
      
      // Determinar mi símbolo basado en el connectionId
      // Como no tenemos acceso directo al connectionId del cliente,
      // lo determinamos por orden de llegada
      console.log('🎮 Estado del juego actualizado:', {
        currentTurn: gameState.currentTurn,
        winner: gameState.winner,
        gameOver: gameState.gameOver,
        waitingForPlayer: gameState.waitingForPlayer,
        board: gameState.board
      });
    });
  }

  /**
   * Realiza un movimiento en una posición del tablero
   */
  async handleCellPress(position: number): Promise<void> {
    if (!this.isConnected) {
      console.warn('⚠️ No hay conexión con el servidor');
      return;
    }

    if (this.gameState.waitingForPlayer) {
      runInAction(() => {
        this.errorMessage = 'Esperando al segundo jugador...';
      });
      console.warn('⚠️ Esperando al segundo jugador');
      return;
    }

    if (this.gameState.gameOver) {
      runInAction(() => {
        this.errorMessage = 'El juego ha terminado. Reinicia para jugar de nuevo.';
      });
      console.warn('⚠️ El juego ya terminó');
      return;
    }

    if (!this.gameState.isCellEmpty(position)) {
      console.warn('⚠️ Casilla ocupada');
      return;
    }

    try {
      console.log(`📤 ViewModel: Enviando movimiento en posición ${position}`);
      await this.gameUseCases.makeMove(position);
      
      runInAction(() => {
        this.errorMessage = '';
      });
      
      console.log('✅ ViewModel: Movimiento enviado');
    } catch (error: any) {
      console.error('❌ ViewModel: Error al realizar movimiento:', error);
      runInAction(() => {
        this.errorMessage = error.message || 'Error al realizar movimiento';
      });
    }
  }

  /**
   * Reinicia el juego
   */
  async resetGame(): Promise<void> {
    if (!this.isConnected) {
      console.warn('⚠️ No hay conexión con el servidor');
      return;
    }

    try {
      console.log('🔄 ViewModel: Solicitando reinicio...');
      await this.gameUseCases.resetGame();
      
      runInAction(() => {
        this.errorMessage = '';
      });
      
      console.log('✅ ViewModel: Juego reiniciado');
    } catch (error: any) {
      console.error('❌ ViewModel: Error al reiniciar:', error);
      runInAction(() => {
        this.errorMessage = error.message || 'Error al reiniciar el juego';
      });
    }
  }

  /**
   * Desconecta del servidor
   */
  async disconnect(): Promise<void> {
    console.log('🔌 Desconectando desde ViewModel...');
    await this.gameUseCases.disconnect();
    runInAction(() => {
      this.isConnected = false;
    });
  }

  /**
   * Getter computed para el mensaje de estado
   */
  get statusMessage(): string {
    if (!this.isConnected) {
      return 'Conectando...';
    }

    if (this.gameState.waitingForPlayer) {
      return 'Esperando oponente...';
    }

    if (this.gameState.gameOver) {
      if (this.gameState.winner === 'draw') {
        return '🤝 ¡Empate!';
      }
      return `🏆 ¡Ganó ${this.gameState.winner}!`;
    }

    return `Turno de: ${this.gameState.currentTurn}`;
  }

  /**
   * Getter para saber si es mi turno
   */
  get isMyTurn(): boolean {
    // Esta lógica se puede mejorar cuando tengamos el connectionId del cliente
    return !this.gameState.waitingForPlayer && !this.gameState.gameOver;
  }

  /**
   * Getter para verificar si se puede hacer clic en las celdas
   */
  get canInteract(): boolean {
    return this.isConnected && 
           !this.gameState.waitingForPlayer && 
           !this.gameState.gameOver;
  }
}