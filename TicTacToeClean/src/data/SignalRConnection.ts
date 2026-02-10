import * as signalR from '@microsoft/signalr';
import { inject, injectable } from 'inversify';
import { TYPES } from '../core/types';

@injectable()
export class SignalRConnection {
  private connection: signalR.HubConnection | null = null;

  constructor(@inject(TYPES.HubUrl) private readonly hubUrl: string) {}

  get raw(): signalR.HubConnection {
    if (!this.connection) {
      throw new Error('SignalRConnection no inicializada. Llama a connect() primero.');
    }
    return this.connection;
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  getConnectionId(): string | null {
    return this.connection?.connectionId ?? null;
  }

  async connect(): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        transport: signalR.HttpTransportType.WebSockets | 
                   signalR.HttpTransportType.ServerSentEvents | 
                   signalR.HttpTransportType.LongPolling,
        skipNegotiation: false,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.connection.onreconnecting((error) => {
      console.warn('Reconectando...', error?.message);
    });

    this.connection.onclose((error) => {
      if (error) console.error('Conexión cerrada:', error.message);
    });

    try {
      await this.connection.start();
    } catch (error) {
      console.error('Error al conectar:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connection) return;
    
    try {
      await this.connection.stop();
    } catch (error) {
      console.error('Error al desconectar:', error);
    }
    
    this.connection = null;
  }

  on(eventName: string, handler: (...args: any[]) => void): void {
    this.raw.on(eventName, handler);
  }

  off(eventName: string, handler: (...args: any[]) => void): void {
    this.raw.off(eventName, handler);
  }

  async invoke(methodName: string, ...args: any[]): Promise<any> {
    return this.raw.invoke(methodName, ...args);
  }
}