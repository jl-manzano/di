import { injectable, inject } from 'inversify';
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

  // ========== CONEXIÓN ==========

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

  // ========== BROADCAST DE MOVIMIENTOS ==========
  async broadcastMove(position: number): Promise<void> {
    if (!this.connection.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    if (position < 0 || position > 8) {
      throw new Error('Posición inválida');
    }

    try {
      console.log('📤 Retransmitiendo movimiento:', position);
      await this.connection.invoke('BroadcastMove', position);
      console.log('✅ Movimiento retransmitido');
    } catch (error: any) {
      console.error('❌ Error al retransmitir movimiento:', error);
      throw new Error(`Error al retransmitir: ${error.message}`);
    }
  }

  async broadcastReset(): Promise<void> {
    if (!this.connection.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    try {
      console.log('🔄 Retransmitiendo reinicio...');
      await this.connection.invoke('BroadcastReset');
      console.log('✅ Reinicio retransmitido');
    } catch (error: any) {
      console.error('❌ Error al retransmitir reinicio:', error);
      throw new Error(`Error al retransmitir reinicio: ${error.message}`);
    }
  }

  /**
   * Escucha cuando otro jugador hace un movimiento
   */
  onMoveBroadcasted(callback: (data: { connectionId: string; position: number }) => void): void {
    console.log('👂 Registrando listener para MoveBroadcasted...');
    this.connection.on('MoveBroadcasted', callback);
  }

  /**
   * Escucha cuando otro jugador solicita reinicio
   */
  onResetBroadcasted(callback: (data: { connectionId: string }) => void): void {
    console.log('👂 Registrando listener para ResetBroadcasted...');
    this.connection.on('ResetBroadcasted', callback);
  }

  /**
   * Escucha cuando un jugador se une
   */
  onPlayerJoined(callback: (data: { 
    connectionId: string; 
    symbol: string; 
    playerName: string; 
    playerCount: number 
  }) => void): void {
    console.log('👂 Registrando listener para PlayerJoined...');
    this.connection.on('PlayerJoined', callback);
  }

  /**
   * Escucha cuando el oponente se desconecta
   */
  onOpponentDisconnected(callback: () => void): void {
    console.log('👂 Registrando listener para OpponentDisconnected...');
    this.connection.on('OpponentDisconnected', callback);
  }

  /**
   * Escucha cuando el oponente abandona la sala
   */
  onOpponentLeft(callback: () => void): void {
    console.log('👂 Registrando listener para OpponentLeft...');
    this.connection.on('OpponentLeft', callback);
  }

  // ========== GESTIÓN DE SALAS ==========

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

  async leaveRoom(): Promise<void> {
    if (!this.connection.isConnected()) {
      throw new Error('No hay conexión con el servidor');
    }

    try {
      console.log('🚪 Saliendo de la sala...');
      await this.connection.invoke('LeaveRoom');
      console.log('✅ Salió de la sala');
    } catch (error: any) {
      console.error('❌ Error al salir de la sala:', error);
      throw new Error(`Error al salir de la sala: ${error.message}`);
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
      try {
        const rooms = roomsJSON.map(json => Room.fromJSON(json));
        callback(rooms);
      } catch (error) {
        console.error('❌ Error parseando salas:', error);
      }
    });
  }
}