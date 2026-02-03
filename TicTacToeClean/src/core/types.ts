// core/types.ts

export interface AppConfig {
  hubUrl: string;
  autoReconnect: boolean;
  logLevel: 'debug' | 'info' | 'warning' | 'error';
}

export const TYPES = {
  // Config
  AppConfig: Symbol.for('AppConfig'),
  HubUrl: Symbol.for('HubUrl'),

  // SignalR shared connection
  SignalRConnection: Symbol.for('SignalRConnection'),

  // Repositories
  IGameRepository: Symbol.for('IGameRepository'),
  IRoomRepository: Symbol.for('IRoomRepository'),

  // Use Cases
  IGameUseCases: Symbol.for('IGameUseCases'),

  // ViewModels
  GameViewModel: Symbol.for('GameViewModel'),
};
