import { injectable, inject } from 'inversify';
import { GameState } from '../entities/GameState';
import { Room } from '../entities/Room';
import { IGameUseCases } from '../interfaces/IGameUseCases';
import { ISignalRConnection } from '../../data/SignalRConnection';
import { TYPES } from '../../core/types';

@injectable()
export class GameUseCases implements IGameUseCases {
  private connection: ISignalRConnection;

  constructor(
    @inject(TYPES.ISignalRConnection) connection: ISignalRConnection
  ) {
    this.connection = connection;
    console.log('🔧 GameUseCases creado con conexión inyectada');
  }

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

  // ========== NUEVOS MÉTODOS PARA SALAS ==========

  async createRoom(roomName: string): Promise<void> {
    if (!this.connection.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    try {
      console.log('🏗️ Creando sala:', roomName);
      await this.connection.invoke('CreateRoom', roomName);
      console.log('✅ Sala creada');
    } catch (error: any) {
      console.error('❌ Error al crear sala:', error);
      throw new Error(`Error al crear sala: ${error.message}`);
    }
  }

  async joinRoom(roomId: string, playerName: string = 'Jugador'): Promise<void> {
    if (!this.connection.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    try {
      console.log('🚪 Uniéndose a sala:', roomId);
      await this.connection.invoke('JoinRoom', roomId, playerName);
      console.log('✅ Unido a sala');
    } catch (error: any) {
      console.error('❌ Error al unirse a sala:', error);
      throw new Error(`Error al unirse a sala: ${error.message}`);
    }
  }

  async getRoomList(): Promise<void> {
    if (!this.connection.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    try {
      console.log('📥 Solicitando lista de salas...');
      await this.connection.invoke('GetRoomList');
      console.log('✅ Lista de salas solicitada');
    } catch (error: any) {
      console.error('❌ Error al solicitar lista:', error);
      throw new Error(`Error al obtener lista: ${error.message}`);
    }
  }

  onRoomListUpdated(callback: (rooms: Room[]) => void): void {
    console.log('👂 Registrando listener para RoomListUpdated...');

    this.connection.on('RoomListUpdated', (roomsJSON: any[]) => {
      console.log('📩 Lista de salas recibida:', roomsJSON);
      
      try {
        const rooms = roomsJSON.map(json => Room.fromJSON(json));
        console.log('✅ Salas parseadas:', rooms.length);
        callback(rooms);
      } catch (error) {
        console.error('❌ Error parseando salas:', error);
      }
    });

    console.log('✅ Listener de salas registrado');
  }

  // ========== FIN NUEVOS MÉTODOS ==========

  async disconnect(): Promise<void> {
    console.log('🔌 Desconectando...');
    await this.connection.stop();
    console.log('✅ Desconectado');
  }

  isConnected(): boolean {
    return this.connection.isConnected();
  }

  getConnectionId(): string | null {
    return this.connection.getConnectionId();
  }
}