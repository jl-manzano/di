import { clsMensajeUsuario } from '../entities/clsMensajeUsuario';

/**
 * DOMAIN LAYER - Interfaz de Casos de Uso
 * 
 * Define el contrato para los casos de uso de mensajes
 * Principio de Inversión de Dependencias (SOLID)
 */
export interface IMessageUseCases {
  /**
   * Inicializa la conexión con el servidor
   */
  initializeConnection(): Promise<void>;

  /**
   * Envía un mensaje al servidor
   */
  sendMessage(mensaje: clsMensajeUsuario): Promise<void>;

  /**
   * Suscribe un callback para recibir mensajes
   */
  onMessageReceived(callback: (mensaje: clsMensajeUsuario) => void): void;

  /**
   * Desconecta del servidor
   */
  disconnect(): Promise<void>;

  /**
   * Verifica si está conectado
   */
  isConnected(): boolean;
}