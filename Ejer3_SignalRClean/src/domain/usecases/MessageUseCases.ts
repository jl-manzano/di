import * as signalR from '@microsoft/signalr';
import { clsMensajeUsuario } from '../entities/clsMensajeUsuario';
import { IMessageUseCases } from '../interfaces/IMessageUseCases';

export class MessageUseCases implements IMessageUseCases {
  private connection: signalR.HubConnection | null = null;
  private readonly hubUrl: string;

  constructor(hubUrl: string) {
    this.hubUrl = hubUrl;
    console.log('🔧 MessageUseCases creado con URL:', hubUrl);
  }

  async initializeConnection(): Promise<void> {
    try {
      console.log('🔌 Intentando conectar a:', this.hubUrl);

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

      // Eventos de reconexión
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
      console.log('✅ Conexión establecida');
      console.log('   State:', this.connection.state);
      console.log('   Connection ID:', this.connection.connectionId);
    } catch (error: any) {
      console.error('❌ Error al conectar con SignalR:');
      console.error('   URL:', this.hubUrl);
      console.error('   Mensaje:', error.message);
      console.error('   Stack:', error.stack);
      throw new Error(`No se pudo conectar: ${error.message}`);
    }
  }

  async sendMessage(mensaje: clsMensajeUsuario): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('No hay conexión con el servidor');
    }

    if (!mensaje.isValid()) {
      throw new Error('El mensaje no es válido');
    }

    try {
      const payload = mensaje.toJSON();
      
      console.log('📤 Enviando mensaje al servidor:');
      console.log('   Payload:', JSON.stringify(payload));
      console.log('   Type:', typeof payload);
      
      await this.connection.invoke('SendMessage', payload);
      
      console.log('✅ Mensaje enviado exitosamente');
    } catch (error: any) {
      console.error('❌ Error al enviar mensaje:', error);
      console.error('   Mensaje error:', error.message);
      throw new Error(`Error al enviar: ${error.message}`);
    }
  }

  onMessageReceived(callback: (mensaje: clsMensajeUsuario) => void): void {
    if (!this.connection) {
      throw new Error('La conexión no ha sido inicializada');
    }

    this.connection.on('ReceiveMessage', (mensajeJSON: any) => {
      console.log('📩 Mensaje recibido del servidor (raw):', JSON.stringify(mensajeJSON));
      
      try {
        const mensaje = clsMensajeUsuario.fromJSON(mensajeJSON);
        console.log('✅ Mensaje parseado correctamente:', {
          usuario: mensaje.usuario,
          mensaje: mensaje.mensaje
        });
        callback(mensaje);
      } catch (error) {
        console.error('❌ Error parseando mensaje:', error);
      }
    });

    console.log('👂 Listener ReceiveMessage registrado');
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      console.log('🔌 Conexión cerrada correctamente');
    }
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}