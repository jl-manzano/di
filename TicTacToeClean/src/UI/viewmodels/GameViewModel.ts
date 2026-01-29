/**
 * APPLICATION LAYER - GameViewModel
 * ViewModel principal que gestiona el estado del juego
 * Implementa el patrón MVVM con MobX
 */
import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { GameState } from '../../domain/entities/GameState';
import { Player } from '../../domain/entities/Player';
import { Room } from '../../domain/entities/Room';
import { IGameUseCases } from '../../domain/interfaces/IGameUseCases';
import { TYPES } from '../../core/types';

export type PlayerSymbol = 'X' | 'O' | null;

@injectable()
export class GameViewModel {
  // Estado del juego
  gameState: GameState = new GameState();
  
  // Estado de conexión
  isConnected = false;
  connectionId: string | null = null;
  errorMessage = '';
  
  // Estado de salas
  rooms: Room[] = [];
  showCreateRoomModal = false;
  isLoadingRooms = false;
  currentRoomId: string | null = null;

  private gameUseCases: IGameUseCases;

  constructor(@inject(TYPES.IGameUseCases) gameUseCases: IGameUseCases) {
    this.gameUseCases = gameUseCases;
    makeAutoObservable(this);
    console.log('🎮 GameViewModel inicializado');
  }

  // ========== INICIALIZACIÓN ==========

  async initialize(): Promise<void> {
    try {
      console.log('🚀 Inicializando ViewModel...');
      
      // Inicializar conexión
      await this.gameUseCases.initializeConnection();

      runInAction(() => {
        this.isConnected = this.gameUseCases.isConnected();
        this.connectionId = this.gameUseCases.getConnectionId();
        this.errorMessage = '';
      });

      console.log('✅ Conexión establecida:', {
        connected: this.isConnected,
        connectionId: this.connectionId
      });

      // ========== REGISTRAR LISTENERS ==========

      // Cuando un jugador se une
      this.gameUseCases.onPlayerJoined((data) => {
        console.log('📩 Jugador unido:', data);
        runInAction(() => {
          const player = new Player(data.connectionId, data.symbol, data.playerName);
          
          if (data.symbol === 'X') {
            this.gameState.playerX = player;
          } else {
            this.gameState.playerO = player;
          }

          console.log('✅ Estado actualizado:', {
            playerX: this.gameState.playerX?.name,
            playerO: this.gameState.playerO?.name,
            waitingForPlayer: this.gameState.waitingForPlayer
          });
        });
      });

      // Cuando otro jugador hace un movimiento
      this.gameUseCases.onMoveBroadcasted((data) => {
        console.log('📩 Movimiento recibido:', data);
        
        // Si el movimiento es mío, no hacer nada (ya actualicé localmente)
        if (data.connectionId === this.connectionId) {
          console.log('ℹ️ Movimiento propio ignorado');
          return;
        }

        // Aplicar el movimiento del oponente
        runInAction(() => {
          const opponentSymbol = this.getOpponentSymbol();
          if (opponentSymbol) {
            const success = this.gameState.makeMove(data.position, opponentSymbol);
            if (success) {
              console.log('✅ Movimiento del oponente aplicado');
            }
          }
        });
      });

      // Cuando otro jugador solicita reinicio
      this.gameUseCases.onResetBroadcasted((data) => {
        console.log('📩 Reinicio recibido:', data);
        runInAction(() => {
          this.gameState.reset();
          console.log('✅ Juego reiniciado');
        });
      });

      // Cuando el oponente se desconecta
      this.gameUseCases.onOpponentDisconnected(() => {
        console.log('📩 Oponente desconectado');
        runInAction(() => {
          this.gameState = new GameState();
          this.errorMessage = 'Tu oponente se desconectó';
        });
      });

      // Cuando el oponente abandona la sala
      this.gameUseCases.onOpponentLeft(() => {
        console.log('📩 Oponente abandonó la sala');
        runInAction(() => {
          this.gameState = new GameState();
          this.errorMessage = 'Tu oponente abandonó la sala';
        });
      });

      // Actualizar lista de salas
      this.gameUseCases.onRoomListUpdated((rooms) => {
        console.log('📩 Lista de salas actualizada:', rooms.length, 'salas');
        runInAction(() => {
          this.rooms = rooms;
          this.isLoadingRooms = false;
        });
      });

      // Solicitar lista inicial de salas
      await this.refreshRooms();
      
      console.log('✅ ViewModel inicializado completamente');
    } catch (error: any) {
      console.error('❌ Error al inicializar ViewModel:', error);
      runInAction(() => {
        this.isConnected = false;
        this.errorMessage = error.message;
      });
      throw error;
    }
  }

  // ========== GETTERS ==========

  /**
   * Obtiene el símbolo del jugador actual
   */
  get mySymbol(): PlayerSymbol {
    if (!this.connectionId) return null;
    if (this.gameState.playerX?.connectionId === this.connectionId) return 'X';
    if (this.gameState.playerO?.connectionId === this.connectionId) return 'O';
    return null;
  }

  /**
   * Verifica si es el turno del jugador actual
   */
  get isMyTurn(): boolean {
    if (!this.mySymbol || this.gameState.gameOver || this.gameState.waitingForPlayer) {
      return false;
    }
    return this.gameState.currentTurn === this.mySymbol;
  }

  /**
   * Verifica si estamos esperando al oponente
   */
  get isWaitingForOpponent(): boolean {
    return this.gameState.waitingForPlayer;
  }

  /**
   * Obtiene el estado actual del juego en formato legible
   */
  get gameStatus(): string {
    if (this.gameState.gameOver) {
      if (this.gameState.winner === 'draw') return '¡Empate!';
      if (this.gameState.winner === this.mySymbol) return '¡Ganaste!';
      return 'Perdiste';
    }
    if (this.gameState.waitingForPlayer) return 'Esperando oponente...';
    if (this.isMyTurn) return 'Tu turno';
    return 'Turno del rival';
  }

  /**
   * Obtiene el símbolo del oponente
   */
  private getOpponentSymbol(): PlayerSymbol {
    if (this.mySymbol === 'X') return 'O';
    if (this.mySymbol === 'O') return 'X';
    return null;
  }

  // ========== ACCIONES DEL JUEGO ==========

  /**
   * Maneja el clic en una celda del tablero
   * ✅ NUEVA LÓGICA:
   * 1. Validar y aplicar el movimiento localmente
   * 2. Retransmitir al servidor (que lo enviará al oponente)
   */
  async handleCellPress(position: number): Promise<void> {
    if (!this.isMyTurn) {
      console.warn('⚠️ No es tu turno');
      return;
    }

    if (!this.gameState.isCellEmpty(position)) {
      console.warn('⚠️ Celda ya ocupada');
      return;
    }

    if (!this.mySymbol) {
      console.warn('⚠️ No tienes símbolo asignado');
      return;
    }

    try {
      // 1️⃣ Aplicar movimiento LOCALMENTE
      const success = this.gameState.makeMove(position, this.mySymbol);
      
      if (!success) {
        console.warn('⚠️ Movimiento inválido');
        return;
      }

      // 2️⃣ Retransmitir al servidor (para el oponente)
      await this.gameUseCases.broadcastMove(position);
      console.log('✅ Movimiento aplicado y retransmitido');

    } catch (error: any) {
      console.error('❌ Error al hacer movimiento:', error);
      runInAction(() => this.errorMessage = error.message);
      throw error;
    }
  }

  /**
   * Reinicia el juego
   * ✅ NUEVA LÓGICA:
   * 1. Reiniciar localmente
   * 2. Retransmitir al servidor
   */
  async resetGame(): Promise<void> {
    if (!this.isConnected) {
      console.warn('⚠️ No conectado al servidor');
      return;
    }

    try {
      // 1️⃣ Reiniciar LOCALMENTE
      runInAction(() => {
        this.gameState.reset();
      });

      // 2️⃣ Retransmitir al servidor
      await this.gameUseCases.broadcastReset();
      console.log('✅ Juego reiniciado y retransmitido');

    } catch (error: any) {
      console.error('❌ Error al reiniciar:', error);
      runInAction(() => this.errorMessage = error.message);
      throw error;
    }
  }

  // ========== GESTIÓN DE SALAS ==========

  /**
   * Crea una nueva sala
   */
  async createRoom(roomName: string): Promise<void> {
    if (!this.isConnected) {
      throw new Error('No hay conexión con el servidor');
    }

    if (!roomName.trim()) {
      throw new Error('El nombre de la sala no puede estar vacío');
    }

    try {
      console.log('🏗️ Creando sala:', roomName);
      await this.gameUseCases.createRoom(roomName.trim());
      
      runInAction(() => {
        this.showCreateRoomModal = false;
      });
      
      console.log('✅ Sala creada exitosamente');
    } catch (error: any) {
      console.error('❌ Error al crear sala:', error);
      throw error;
    }
  }

  /**
   * Se une a una sala existente
   */
  async joinRoom(roomId: string, playerName: string = 'Jugador'): Promise<void> {
    if (!this.isConnected) {
      throw new Error('No hay conexión con el servidor');
    }

    try {
      console.log('🚪 Uniéndose a sala:', roomId);
      
      // Limpiar estado anterior
      runInAction(() => {
        this.gameState = new GameState();
        this.currentRoomId = roomId;
      });

      await this.gameUseCases.joinRoom(roomId, playerName);
      console.log('✅ Unido a sala exitosamente');
    } catch (error: any) {
      console.error('❌ Error al unirse a sala:', error);
      throw error;
    }
  }

  /**
   * Sale de la sala actual
   */
  async leaveRoom(): Promise<void> {
    if (!this.isConnected) {
      console.warn('⚠️ No conectado al servidor');
      return;
    }

    try {
      console.log('🚪 Saliendo de la sala...');
      
      await this.gameUseCases.leaveRoom();
      
      runInAction(() => {
        this.currentRoomId = null;
        this.gameState = new GameState();
      });
      
      await this.refreshRooms();
      console.log('✅ Salió de la sala exitosamente');
    } catch (error: any) {
      console.error('❌ Error al salir de la sala:', error);
      runInAction(() => this.errorMessage = error.message);
      throw error;
    }
  }

  /**
   * Actualiza la lista de salas
   */
  async refreshRooms(): Promise<void> {
    if (!this.isConnected) {
      console.warn('⚠️ No conectado al servidor');
      return;
    }

    runInAction(() => {
      this.isLoadingRooms = true;
      this.errorMessage = '';
    });

    try {
      console.log('🔄 Actualizando lista de salas...');
      await this.gameUseCases.getRoomList();
    } catch (error: any) {
      console.error('❌ Error al actualizar salas:', error);
      runInAction(() => {
        this.isLoadingRooms = false;
        this.errorMessage = error.message;
      });
      throw error;
    }
  }

  /**
   * Desconecta del servidor
   */
  async disconnect(): Promise<void> {
    try {
      console.log('🔌 Desconectando...');
      await this.gameUseCases.disconnect();
      
      runInAction(() => {
        this.isConnected = false;
        this.connectionId = null;
        this.rooms = [];
        this.currentRoomId = null;
        this.gameState = new GameState();
      });
      
      console.log('✅ Desconectado correctamente');
    } catch (error: any) {
      console.error('❌ Error al desconectar:', error);
      throw error;
    }
  }

  /**
   * Imprime el estado actual en la consola (para debugging)
   */
  logState(): void {
    console.log('📊 Estado actual del ViewModel:', {
      isConnected: this.isConnected,
      connectionId: this.connectionId,
      mySymbol: this.mySymbol,
      isMyTurn: this.isMyTurn,
      gameStatus: this.gameStatus,
      roomsCount: this.rooms.length,
      currentRoomId: this.currentRoomId
    });
  }
}