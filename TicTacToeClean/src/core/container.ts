import { Container } from 'inversify';
import 'reflect-metadata';
import { AppConfig, TYPES } from './types';

// Shared SignalR connection
import { SignalRConnection } from '../data/SignalRConnection';

// Repositories
import { SignalRGameRepository } from '../data/SignalRGameRepository';
import { SignalRRoomRepository } from '../data/SignalRRoomRepository';
import { IGameRepository } from '../domain/interfaces/IGameRepository';
import { IRoomRepository } from '../domain/interfaces/IRoomRepository';

// UseCases
import { IGameUseCases } from '../domain/interfaces/IGameUseCases';
import { GameUseCases } from '../domain/usecases/GameUseCases';

// ViewModels
import { GameViewModel } from '../UI/viewmodels/GameViewModel';

export function createContainer(config: AppConfig): Container {
  const container = new Container();

  // CONFIG
  container.bind<AppConfig>(TYPES.AppConfig).toConstantValue(config);
  container.bind<string>(TYPES.HubUrl).toConstantValue(config.hubUrl);

  // Shared SignalR connection (SINGLETON)
  container.bind<SignalRConnection>(TYPES.SignalRConnection)
    .to(SignalRConnection)
    .inSingletonScope();

  // REPOSITORIES (SINGLETON)
  container.bind<IGameRepository>(TYPES.IGameRepository)
    .to(SignalRGameRepository)
    .inSingletonScope();

  container.bind<IRoomRepository>(TYPES.IRoomRepository)
    .to(SignalRRoomRepository)
    .inSingletonScope();

  // USE CASES
  container.bind<IGameUseCases>(TYPES.IGameUseCases)
    .to(GameUseCases)
    .inSingletonScope();

  // VIEWMODEL
  container.bind<GameViewModel>(TYPES.GameViewModel)
    .to(GameViewModel)
    .inSingletonScope();

  return container;
}

export function getGameViewModel(container: Container): GameViewModel {
  return container.get<GameViewModel>(TYPES.GameViewModel);
}

export function getAppConfig(container: Container): AppConfig {
  return container.get<AppConfig>(TYPES.AppConfig);
}

export function clearContainer(container: Container): void {
  container.unbindAll();
}
