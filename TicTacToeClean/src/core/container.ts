import 'reflect-metadata';
import { Container } from 'inversify';
import { ISignalRConnection, SignalRConnection } from '../data/SignalRConnection';
import { IGameUseCases } from '../domain/interfaces/IGameUseCases';
import { GameUseCases } from '../domain/usecases/GameUseCases';
import { GameViewModel } from '../UI/viewmodels/GameViewModel';
import { AppConfig, TYPES } from './types';

export function createContainer(config: AppConfig): Container {
  const container = new Container();
  
  console.log('🔧 Creando nuevo contenedor de dependencias...');
  console.log(`   Hub URL: ${config.hubUrl}`);
  console.log(`   Auto Reconnect: ${config.autoReconnect}`);
  console.log(`   Log Level: ${config.logLevel}`);

  container.bind<AppConfig>(TYPES.AppConfig).toConstantValue(config);
  container.bind<string>(TYPES.HubUrl).toConstantValue(config.hubUrl);

  container.bind<ISignalRConnection>(TYPES.ISignalRConnection)
    .to(SignalRConnection)
    .inSingletonScope();

  container.bind<IGameUseCases>(TYPES.IGameUseCases)
    .to(GameUseCases)
    .inSingletonScope();

  container.bind<GameViewModel>(TYPES.GameViewModel)
    .to(GameViewModel)
    .inSingletonScope();

  console.log('✅ Contenedor creado correctamente\n');
  
  return container;
}

/**
 * Helper para obtener el GameViewModel de un contenedor
 */
export function getGameViewModel(container: Container): GameViewModel {
  return container.get<GameViewModel>(TYPES.GameViewModel);
}

/**
 * Helper para obtener la configuración de un contenedor
 */
export function getAppConfig(container: Container): AppConfig {
  return container.get<AppConfig>(TYPES.AppConfig);
}

/**
 * Helper para obtener GameUseCases de un contenedor
 */
export function getGameUseCases(container: Container): IGameUseCases {
  return container.get<IGameUseCases>(TYPES.IGameUseCases);
}

/**
 * Helper para obtener la conexión SignalR de un contenedor
 */
export function getSignalRConnection(container: Container): ISignalRConnection {
  return container.get<ISignalRConnection>(TYPES.ISignalRConnection);
}

/**
 * Limpia un contenedor (útil para testing o cleanup)
 */
export function clearContainer(container: Container): void {
  container.unbindAll();
  console.log('🧹 Contenedor limpiado');
}