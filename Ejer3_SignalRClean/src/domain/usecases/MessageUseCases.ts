import * as signalR from '@microsoft/signalr';
import { clsMensajeUsuario } from '../entities/clsMensajeUsuario';
import { IMessageUseCases } from '../interfaces/IMessageUseCases';

export class MessageUseCases implements IMessageUseCases {
  private connection: signalR.HubConnection | null = null;
  private readonly hubUrl: string;

  constructor(hubUrl: string) {
    this.hubUrl = hubUrl;
  }

  async initializeConnection(): Promise<void> {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)  // ✅ Agregar logs
        .build();

      await this.connection.start();
      console.log('✅ Conexión establecida con SignalR');
    } catch (error) {
      console.error('❌ Error al conectar con SignalR:', error);
      throw new Error('No se pudo conectar con el servidor');
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
      // ✅ Convertir a objeto plano
      const payload = mensaje.toJSON();
      
      console.log('📤 Enviando al servidor:');
      console.log('   payload:', JSON.stringify(payload));
      console.log('   type:', typeof payload);
      
      // ✅ Enviar como objeto (no como JSON string)
      await this.connection.invoke('SendMessage', payload);
      
      console.log('✅ Mensaje enviado exitosamente');
    } catch (error: any) {
      console.error('❌ Error al enviar mensaje:', error);
      console.error('   Mensaje error:', error.message);
      throw new Error('No se pudo enviar el mensaje');
    }
  }

  onMessageReceived(callback: (mensaje: clsMensajeUsuario) => void): void {
    if (!this.connection) {
      throw new Error('La conexión no ha sido inicializada');
    }

    this.connection.on('ReceiveMessage', (mensajeJSON: any) => {
      console.log('📩 Mensaje recibido del servidor:', mensajeJSON);
      const mensaje = clsMensajeUsuario.fromJSON(mensajeJSON);
      callback(mensaje);
    });
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      console.log('🔌 Conexión cerrada');
    }
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}