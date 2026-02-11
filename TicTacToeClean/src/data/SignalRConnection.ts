/**
 * @file SignalRConnection.ts
 * @summary Wrapper singleton para la conexión SignalR con el servidor.
 * 
 * Esta clase encapsula toda la lógica de conexión, reconexión y comunicación
 * bidireccional con el servidor de juego mediante SignalR. Actúa como una
 * capa de abstracción que oculta los detalles de implementación del protocolo
 * de comunicación en tiempo real.
 * 
 * Características:
 * - Soporte para múltiples transportes (WebSockets, SSE, Long Polling)
 * - Reconexión automática con backoff exponencial
 * - Gestión centralizada de eventos y métodos RPC
 * - Manejo de errores y logging configurable
 */

import * as signalR from '@microsoft/signalr';
import { inject, injectable } from 'inversify';
import { TYPES } from '../core/types';

@injectable()
export class SignalRConnection {
  /** Instancia interna de la conexión SignalR */
  private connection: signalR.HubConnection | null = null;

  /**
   * Crea una nueva instancia del wrapper de conexión.
   * 
   * @param hubUrl - URL del hub SignalR inyectada desde el contenedor
   */
  constructor(@inject(TYPES.HubUrl) private readonly hubUrl: string) {}

  /**
   * Acceso directo a la conexión SignalR subyacente.
   * Lanza error si la conexión no ha sido inicializada.
   * 
   * @throws Error si la conexión no está inicializada
   */
  get raw(): signalR.HubConnection {
    if (!this.connection) {
      throw new Error('SignalRConnection no inicializada. Llama a connect() primero.');
    }
    return this.connection;
  }

  /**
   * Verifica si la conexión está activa y conectada al servidor.
   * 
   * @returns true si está conectado, false en caso contrario
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  /**
   * Obtiene el ID único de conexión asignado por el servidor.
   * 
   * @returns ID de conexión o null si no está conectado
   */
  getConnectionId(): string | null {
    return this.connection?.connectionId ?? null;
  }

  /**
   * Establece la conexión con el servidor SignalR.
   * Configura los transportes, reconexión automática y handlers de eventos.
   * Si ya está conectado, no hace nada.
   * 
   * @throws Error si no puede establecer la conexión
   */
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

  /**
   * Cierra la conexión con el servidor de forma limpia.
   * Libera los recursos y resetea el estado interno.
   */
  async disconnect(): Promise<void> {
    if (!this.connection) return;
    
    try {
      await this.connection.stop();
    } catch (error) {
      console.error('Error al desconectar:', error);
    }
    
    this.connection = null;
  }

  /**
   * Registra un handler para un evento del servidor.
   * 
   * @param eventName - Nombre del evento a escuchar
   * @param handler - Función callback que procesa el evento
   */
  on(eventName: string, handler: (...args: any[]) => void): void {
    this.raw.on(eventName, handler);
  }

  /**
   * Elimina un handler previamente registrado para un evento.
   * 
   * @param eventName - Nombre del evento
   * @param handler - Referencia al handler a eliminar
   */
  off(eventName: string, handler: (...args: any[]) => void): void {
    this.raw.off(eventName, handler);
  }

  /**
   * Invoca un método en el servidor y espera su respuesta.
   * 
   * @param methodName - Nombre del método del hub a invocar
   * @param args - Argumentos a pasar al método
   * @returns Promesa con el resultado del método
   */
  async invoke(methodName: string, ...args: any[]): Promise<any> {
    return this.raw.invoke(methodName, ...args);
  }
}