/**
 * UI LAYER - ViewModel para el Chat
 * 
 * Gestiona el estado y la lógica de presentación del chat
 * Patrón MVVM con MobX para reactividad
 */

import { injectable, inject } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { clsMensajeUsuario } from '../../domain/entities/clsMensajeUsuario';
import { IMessageUseCases } from '../../domain/interfaces/IMessageUseCases';
import { TYPES } from '../../core/types';

/**
 * ViewModel del Chat
 * @injectable - Marca la clase como inyectable por InversifyJS
 */
@injectable()
export class ChatViewModel {
  // Estado observable con MobX
  messages: clsMensajeUsuario[] = [];
  userInput: string = '';
  messageInput: string = '';
  isConnected: boolean = false;
  errorMessage: string = '';

  private messageUseCases: IMessageUseCases;

  /**
   * Constructor con inyección de dependencias
   * @inject - Inyecta IMessageUseCases desde el contenedor
   */
  constructor(
    @inject(TYPES.IMessageUseCases) messageUseCases: IMessageUseCases
  ) {
    this.messageUseCases = messageUseCases;
    makeAutoObservable(this);
    console.log('🎯 ChatViewModel inicializado con InversifyJS');
  }

  /**
   * Inicializa la conexión y configura listeners
   */
  async initialize(): Promise<void> {
    console.log('🚀 Iniciando conexión desde ViewModel...');
    try {
      await this.messageUseCases.initializeConnection();
      
      runInAction(() => {
        this.isConnected = true;
        this.errorMessage = '';
        console.log('✅ ViewModel: Conexión establecida');
      });

      // Configurar listener para mensajes entrantes
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

  /**
   * Actualiza el input de usuario
   */
  setUserInput(value: string): void {
    this.userInput = value;
  }

  /**
   * Actualiza el input de mensaje
   */
  setMessageInput(value: string): void {
    this.messageInput = value;
  }

  /**
   * Envía un mensaje al servidor
   */
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

  /**
   * Agrega un mensaje a la lista (privado)
   */
  private addMessage(mensaje: clsMensajeUsuario): void {
    runInAction(() => {
      this.messages.push(mensaje);
      console.log(`📝 Mensaje agregado. Total: ${this.messages.length}`);
    });
  }

  /**
   * Limpia todos los mensajes
   */
  clearMessages(): void {
    runInAction(() => {
      this.messages = [];
      console.log('🧹 Mensajes limpiados');
    });
  }

  /**
   * Desconecta del servidor
   */
  async disconnect(): Promise<void> {
    console.log('🔌 Desconectando desde ViewModel...');
    await this.messageUseCases.disconnect();
    runInAction(() => {
      this.isConnected = false;
    });
  }

  /**
   * Getter computed para el conteo de mensajes
   */
  get messageCount(): number {
    return this.messages.length;
  }
}