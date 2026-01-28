import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { GameState } from '../../domain/entities/GameState';
import { Room } from '../../domain/entities/Room';
import { IGameUseCases } from '../../domain/interfaces/IGameUseCases';
import { TYPES } from '../../core/types';

export type PlayerSymbol = 'X' | 'O' | null;

@injectable()
export class GameViewModel {
  gameState: GameState = new GameState();
  isConnected = false;
  errorMessage = '';

  connectionId: string | null = null;
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

  async initialize(): Promise<void> {
    try {
      console.log('🚀 Inicializando ViewModel...');
      
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

      this.gameUseCases.onGameStateUpdated((state) => {
        console.log('📩 Estado del juego actualizado:', {
          currentTurn: state.currentTurn,
          gameOver: state.gameOver,
          winner: state.winner
        });
        runInAction(() => this.gameState = state);
      });

      this.gameUseCases.onRoomListUpdated((rooms) => {
        console.log('📩 Lista de salas actualizada:', rooms.length, 'salas');
        runInAction(() => {
          this.rooms = rooms;
          this.isLoadingRooms = false;
        });
      });

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

  get mySymbol(): PlayerSymbol {
    if (!this.connectionId) return null;
    if (this.gameState.playerX?.connectionId === this.connectionId) return 'X';
    if (this.gameState.playerO?.connectionId === this.connectionId) return 'O';
    return null;
  }

  get isMyTurn(): boolean {
    if (!this.mySymbol || this.gameState.gameOver || this.gameState.waitingForPlayer) {
      return false;
    }
    return this.gameState.currentTurn === this.mySymbol;
  }

  get isWaitingForOpponent(): boolean {
    return this.gameState.waitingForPlayer;
  }

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

  async handleCellPress(position: number): Promise<void> {
    if (!this.isMyTurn) {
      console.warn('⚠️ No es tu turno');
      return;
    }

    if (!this.gameState.isCellEmpty(position)) {
      console.warn('⚠️ Celda ya ocupada');
      return;
    }

    try {
      console.log('📤 Enviando movimiento:', position);
      await this.gameUseCases.makeMove(position);
    } catch (error: any) {
      console.error('❌ Error al hacer movimiento:', error);
      runInAction(() => this.errorMessage = error.message);
      throw error;
    }
  }

  async resetGame(): Promise<void> {
    if (!this.isConnected) {
      console.warn('⚠️ No conectado al servidor');
      return;
    }

    try {
      console.log('🔄 Reiniciando juego...');
      await this.gameUseCases.resetGame();
    } catch (error: any) {
      console.error('❌ Error al reiniciar:', error);
      runInAction(() => this.errorMessage = error.message);
      throw error;
    }
  }

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

  async joinRoom(roomId: string, playerName: string = 'Jugador'): Promise<void> {
    if (!this.isConnected) {
      throw new Error('No hay conexión con el servidor');
    }

    try {
      console.log('🚪 Uniéndose a sala:', roomId);
      await this.gameUseCases.joinRoom(roomId, playerName);
      
      runInAction(() => {
        this.currentRoomId = roomId;
      });
      
      console.log('✅ Unido a sala exitosamente');
    } catch (error: any) {
      console.error('❌ Error al unirse a sala:', error);
      throw error;
    }
  }

  // ✅ NUEVO: Método para salir de una sala
  async leaveRoom(): Promise<void> {
    if (!this.isConnected) {
      console.warn('⚠️ No conectado al servidor');
      return;
    }

    try {
      console.log('🚪 Saliendo de la sala...');
      
      // Llamar al backend para notificar que salimos
      await this.gameUseCases.leaveRoom();
      
      // Limpiar estado local
      runInAction(() => {
        this.currentRoomId = null;
        this.gameState = new GameState();
      });
      
      // Actualizar lista de salas
      await this.refreshRooms();
      
      console.log('✅ Salió de la sala exitosamente');
    } catch (error: any) {
      console.error('❌ Error al salir de la sala:', error);
      runInAction(() => this.errorMessage = error.message);
      throw error;
    }
  }

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