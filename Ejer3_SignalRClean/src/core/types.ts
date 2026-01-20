/**
 * CORE - Tipos y Símbolos para Inyección de Dependencias
 */

import { clsMensajeUsuario } from '../domain/entities/clsMensajeUsuario';

// Callback para recibir mensajes
export type MessageCallback = (mensaje: clsMensajeUsuario) => void;

// Configuración de la aplicación
export interface AppConfig {
  hubUrl: string;
  autoReconnect: boolean;
  logLevel: 'debug' | 'info' | 'warning' | 'error';
}

// Estados de conexión
export enum ConnectionState {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Reconnecting = 'Reconnecting'
}

/**
 * Identificadores únicos para inyección de dependencias con InversifyJS
 */
export const TYPES = {
  IMessageUseCases: Symbol.for('IMessageUseCases'),
  ChatViewModel: Symbol.for('ChatViewModel'),
  AppConfig: Symbol.for('AppConfig'),
  HubUrl: Symbol.for('HubUrl')
};