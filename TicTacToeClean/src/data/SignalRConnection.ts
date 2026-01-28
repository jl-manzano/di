import { injectable, inject } from 'inversify';
import * as signalR from '@microsoft/signalr';
import { TYPES } from '../core/types';

export interface ISignalRConnection {
  start(): Promise<void>;
  stop(): Promise<void>;
  invoke(methodName: string, ...args: any[]): Promise<void>;
  on(eventName: string, callback: (...args: any[]) => void): void;
  isConnected(): boolean;
  getConnectionId(): string | null;
}

@injectable()
export class SignalRConnection implements ISignalRConnection {
  private connection: signalR.HubConnection | null = null;
  private readonly hubUrl: string;

  constructor(@inject(TYPES.HubUrl) hubUrl: string) {
    this.hubUrl = hubUrl;
    console.log('🔌 SignalRConnection inicializada con URL:', hubUrl);
  }

  async start(): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, { transport: signalR.HttpTransportType.WebSockets })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    this.connection.onreconnecting((err) => console.warn('🔄 Reconectando...', err?.message || ''));
    this.connection.onreconnected((connectionId) => console.log('✅ Reconectado. Connection ID:', connectionId));
    this.connection.onclose((err) => console.error('🔴 Conexión cerrada:', err?.message || ''));

    try {
      await this.connection.start();
      console.log('✅ Conexión SignalR establecida', { state: this.connection.state, connectionId: this.connection.connectionId });
    } catch (error: any) {
      console.error('❌ Error al conectar SignalR:', error.message);
      throw new Error(`No se pudo conectar: ${error.message}`);
    }
  }

  async stop(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      console.log('🔌 Conexión SignalR cerrada');
      this.connection = null;
    }
  }

  async invoke(methodName: string, ...args: any[]): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected)
      throw new Error('No hay conexión activa con el servidor');

    try {
      await this.connection.invoke(methodName, ...args);
    } catch (error: any) {
      throw new Error(`Error al invocar ${methodName}: ${error.message}`);
    }
  }

  on(eventName: string, callback: (...args: any[]) => void): void {
    if (!this.connection) throw new Error('La conexión no ha sido inicializada');
    this.connection.on(eventName, (...args) => callback(...args));
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  getConnectionId(): string | null {
    return this.connection?.connectionId || null;
  }
}
