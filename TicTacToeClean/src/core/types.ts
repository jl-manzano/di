export interface AppConfig {
  hubUrl: string;
  autoReconnect: boolean;
  logLevel: 'debug' | 'info' | 'warning' | 'error';
}

/**
 * Identificadores únicos para inyección de dependencias con InversifyJS
 */
export const TYPES = {
  // Conexión de bajo nivel (Data Layer)
  ISignalRConnection: Symbol.for('ISignalRConnection'),
  
  // Casos de uso (Domain Layer)
  IGameUseCases: Symbol.for('IGameUseCases'),
  
  // ViewModel (Application Layer)
  GameViewModel: Symbol.for('GameViewModel'),
  
  // Configuración
  AppConfig: Symbol.for('AppConfig'),
  HubUrl: Symbol.for('HubUrl')
};