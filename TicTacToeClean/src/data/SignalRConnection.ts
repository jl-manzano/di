/**
 * DATA LAYER - Conexión SignalR
 * 
 * Maneja la conexión de bajo nivel con SignalR
 * Esta clase se inyecta en los casos de uso
 */

import { injectable, inject } from 'inversify';
import * as signalR from '@microsoft/signalr';
import { TYPES } from '../core/types';

/**
 * Interfaz para la conexión SignalR
 */
export interface ISignalRConnection {
  /**
   * Inicia la conexión con el servidor
   */
  start(): Promise<void>;

  /**
   * Detiene la conexión con el servidor
   */
  stop(): Promise<void>;

  /**
   * Invoca un método en el servidor
   */
  invoke(methodName: string, ...args: any[]): Promise<void>;

  /**
   * Registra un listener para un evento del servidor
   */
  on(eventName: string, callback: (...args: any[]) => void): void;

  /**
   * Verifica si la conexión está activa
   */
  isConnected(): boolean;

  /**
   * Obtiene el ID de la conexión actual
   */
  getConnectionId(): string | null;
}

/**
 * Implementación de la conexión SignalR
 * @injectable - Marca la clase como inyectable
 */
@injectable()
export class SignalRConnection implements ISignalRConnection {
  private connection: signalR.HubConnection | null = null;
  private readonly hubUrl: string;

  /**
   * Constructor con inyección de la URL del Hub
   * @inject - Inyecta la URL del Hub de SignalR
   */
  constructor(
    @inject(TYPES.HubUrl) hubUrl: string
  ) {
    this.hubUrl = hubUrl;
    console.log('🔌 SignalRConnection inicializada con URL:', hubUrl);
  }

  /**
   * Inicia la conexión con el servidor SignalR
   */
  async start(): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      console.log('⚠️ La conexión ya está activa');
      return;
    }

    try {
      console.log('🔌 Iniciando conexión SignalR...');

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | 
                     signalR.HttpTransportType.ServerSentEvents | 
                     signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .configureLogging(signalR.LogLevel.Debug)
        .build();

      // Configurar eventos de reconexión
      this.connection.onreconnecting((error) => {
        console.warn('🔄 Reconectando...', error?.message || '');
      });

      this.connection.onreconnected((connectionId) => {
        console.log('✅ Reconectado. Connection ID:', connectionId);
      });

      this.connection.onclose((error) => {
        console.error('🔴 Conexión cerrada:', error?.message || '');
      });

      await this.connection.start();
      console.log('✅ Conexión SignalR establecida');
      console.log('   State:', this.connection.state);
      console.log('   Connection ID:', this.connection.connectionId);
    } catch (error: any) {
      console.error('❌ Error al conectar con SignalR:');
      console.error('   URL:', this.hubUrl);
      console.error('   Mensaje:', error.message);
      throw new Error(`No se pudo conectar: ${error.message}`);
    }
  }

  /**
   * Detiene la conexión con el servidor
   */
  async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      console.log('🔌 Conexión SignalR cerrada');
      this.connection = null;
    }
  }

  /**
   * Invoca un método en el servidor
   */
  async invoke(methodName: string, ...args: any[]): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('No hay conexión activa con el servidor');
    }

    try {
      console.log(`📤 Invocando método: ${methodName}`, args);
      await this.connection.invoke(methodName, ...args);
      console.log(`✅ Método ${methodName} invocado exitosamente`);
    } catch (error: any) {
      console.error(`❌ Error al invocar ${methodName}:`, error.message);
      throw error;
    }
  }

  /**
   * Registra un listener para un evento del servidor
   */
  on(eventName: string, callback: (...args: any[]) => void): void {
    if (!this.connection) {
      throw new Error('La conexión no ha sido inicializada');
    }

    this.connection.on(eventName, (...args) => {
      console.log(`📩 Evento recibido: ${eventName}`, args);
      callback(...args);
    });

    console.log(`👂 Listener registrado para: ${eventName}`);
  }

  /**
   * Verifica si la conexión está activa
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  /**
   * Obtiene el ID de la conexión actual
   */
  getConnectionId(): string | null {
    return this.connection?.connectionId || null;
  }
}