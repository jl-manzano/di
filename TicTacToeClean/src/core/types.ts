/**
 * @file types.ts
 * @summary Definiciones de tipos y símbolos para inyección de dependencias.
 * 
 * Este módulo centraliza todas las definiciones de tipos de configuración
 * y los símbolos únicos utilizados por Inversify para identificar
 * las dependencias en el contenedor IoC.
 * 
 * Los símbolos (TYPES) actúan como identificadores únicos que evitan
 * colisiones de nombres y permiten la resolución correcta de dependencias
 * en tiempo de ejecución.
 */

/**
 * Configuración global de la aplicación.
 * Define los parámetros necesarios para inicializar la conexión
 * y comportamiento del cliente.
 */
export interface AppConfig {
  /** URL completa del hub SignalR del servidor */
  hubUrl: string;
  /** Si debe intentar reconectar automáticamente tras desconexión */
  autoReconnect: boolean;
  /** Nivel de detalle del logging */
  logLevel: 'debug' | 'info' | 'warning' | 'error';
}

/**
 * Símbolos únicos para identificar dependencias en el contenedor IoC.
 * Cada símbolo representa un servicio, repositorio o componente inyectable.
 */
export const TYPES = {
  // Config
  /** Símbolo para la configuración completa de la app */
  AppConfig: Symbol.for('AppConfig'),
  /** Símbolo para la URL del hub SignalR */
  HubUrl: Symbol.for('HubUrl'),

  // SignalR shared connection
  /** Símbolo para la conexión compartida de SignalR */
  SignalRConnection: Symbol.for('SignalRConnection'),

  // Repositories
  /** Símbolo para el repositorio de juego (movimientos, reset, eventos) */
  IGameRepository: Symbol.for('IGameRepository'),
  /** Símbolo para el repositorio de salas (crear, unirse, listar) */
  IRoomRepository: Symbol.for('IRoomRepository'),

  // Use Cases
  /** Símbolo para los casos de uso del juego */
  IGameUseCases: Symbol.for('IGameUseCases'),

  // ViewModels
  /** Símbolo para el ViewModel principal del juego */
  GameViewModel: Symbol.for('GameViewModel'),
};