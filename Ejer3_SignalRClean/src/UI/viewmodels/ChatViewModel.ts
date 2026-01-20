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
  }

  async initialize(): Promise<void> {
    try {
      await this.messageUseCases.initializeConnection();
      
      // ✅ Usar runInAction para modificar observables
      runInAction(() => {
        this.isConnected = true;
        this.errorMessage = '';
      });

      this.messageUseCases.onMessageReceived((mensaje: clsMensajeUsuario) => {
        this.addMessage(mensaje);
      });
    } catch (error) {
      // ✅ Usar runInAction
      runInAction(() => {
        this.isConnected = false;
        this.errorMessage = 'Error al conectar con el servidor';
      });
      console.error(error);
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
      return;
    }

    if (this.messageInput.trim() === '') {
      return;
    }

    try {
      const usuario = this.userInput.trim() || 'Anónimo';
      const mensaje = new clsMensajeUsuario(usuario, this.messageInput);

      await this.messageUseCases.sendMessage(mensaje);

      // ✅ Usar runInAction para limpiar
      runInAction(() => {
        this.messageInput = '';
        this.errorMessage = '';
      });
    } catch (error: any) {
      // ✅ Usar runInAction para errores
      runInAction(() => {
        this.errorMessage = error.message || 'Error al enviar el mensaje';
      });
      console.error(error);
    }
  }

  private addMessage(mensaje: clsMensajeUsuario): void {
    // ✅ Usar runInAction
    runInAction(() => {
      this.messages.push(mensaje);
    });
  }

  clearMessages(): void {
    this.messages = [];
  }

  async disconnect(): Promise<void> {
    await this.messageUseCases.disconnect();
    runInAction(() => {
      this.isConnected = false;
    });
  }

  get messageCount(): number {
    return this.messages.length;
  }
}