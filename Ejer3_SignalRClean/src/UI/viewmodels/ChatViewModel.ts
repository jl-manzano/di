import { makeAutoObservable, runInAction } from 'mobx';
import { clsMensajeUsuario } from '../../domain/entities/clsMensajeUsuario';
import { IMessageUseCases } from '../../domain/interfaces/IMessageUseCases';

export class ChatViewModel {
  messages: clsMensajeUsuario[] = [];
  userInput: string = '';
  messageInput: string = '';
  isConnected: boolean = false;
  errorMessage: string = '';

  private messageUseCases: IMessageUseCases;

  constructor(messageUseCases: IMessageUseCases) {
    this.messageUseCases = messageUseCases;
    makeAutoObservable(this);
    console.log('🎯 ChatViewModel inicializado');
  }

  async initialize(): Promise<void> {
    console.log('🚀 Iniciando conexión desde ViewModel...');
    try {
      await this.messageUseCases.initializeConnection();
      
      runInAction(() => {
        this.isConnected = true;
        this.errorMessage = '';
        console.log('✅ ViewModel: Conexión establecida');
      });

      this.messageUseCases.onMessageReceived((mensaje: clsMensajeUsuario) => {
        console.log('📩 ViewModel recibió mensaje:', mensaje);
        this.addMessage(mensaje);
      });
    } catch (error: any) {
      console.error('❌ ViewModel: Error al conectar:', error);
      runInAction(() => {
        this.isConnected = false;
        this.errorMessage = error.message || 'Error al conectar con el servidor';
      });
    }
  }

  setUserInput(value: string): void {
    this.userInput = value;
  }

  setMessageInput(value: string): void {
    this.messageInput = value;
  }

  async sendMessage(): Promise<void> {
    if (!this.isConnected) {
      runInAction(() => {
        this.errorMessage = 'No hay conexión con el servidor';
      });
      console.warn('⚠️ Intento de envío sin conexión');
      return;
    }

    if (this.messageInput.trim() === '') {
      console.warn('⚠️ Mensaje vacío, no se enviará');
      return;
    }

    try {
      const usuario = this.userInput.trim() || 'Anónimo';
      const mensaje = new clsMensajeUsuario(usuario, this.messageInput);

      console.log('📤 ViewModel: Enviando mensaje:', {
        usuario: mensaje.usuario,
        mensaje: mensaje.mensaje
      });

      await this.messageUseCases.sendMessage(mensaje);

      runInAction(() => {
        this.messageInput = '';
        this.errorMessage = '';
      });
      
      console.log('✅ ViewModel: Mensaje enviado y campo limpiado');
    } catch (error: any) {
      console.error('❌ ViewModel: Error al enviar:', error);
      runInAction(() => {
        this.errorMessage = error.message || 'Error al enviar el mensaje';
      });
    }
  }

  private addMessage(mensaje: clsMensajeUsuario): void {
    runInAction(() => {
      this.messages.push(mensaje);
      console.log(`📝 Mensaje agregado. Total: ${this.messages.length}`);
    });
  }

  clearMessages(): void {
    runInAction(() => {
      this.messages = [];
      console.log('🧹 Mensajes limpiados');
    });
  }

  async disconnect(): Promise<void> {
    console.log('🔌 Desconectando desde ViewModel...');
    await this.messageUseCases.disconnect();
    runInAction(() => {
      this.isConnected = false;
    });
  }

  get messageCount(): number {
    return this.messages.length;
  }
}