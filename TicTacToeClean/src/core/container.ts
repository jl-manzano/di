/**
 * @file container.ts
 * @summary Configuración del contenedor de inyección de dependencias (Inversify).
 * 
 * Este módulo implementa el patrón de Inversión de Control (IoC) para gestionar
 * las dependencias de la aplicación. Configura y registra todos los servicios,
 * repositorios, casos de uso y ViewModels necesarios para el funcionamiento
 * del juego Tic Tac Toe multijugador.
 * 
 * Responsabilidades:
 * - Crear y configurar el contenedor de Inversify
 * - Registrar bindings para configuración, conexiones, repositorios y ViewModels
 * - Gestionar el ciclo de vida de las dependencias (singleton vs transient)
 * - Proveer funciones helper para obtener instancias específicas
 */

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

/**
 * Crea y configura un nuevo contenedor de inyección de dependencias.
 * 
 * @param config - Configuración de la aplicación (URL del hub, reconexión, nivel de log)
 * @returns Contenedor de Inversify completamente configurado con todos los bindings
 * 
 * @example
 * const container = createContainer({
 *   hubUrl: 'https://servidor.com/gameHub',
 *   autoReconnect: true,
 *   logLevel: 'debug'
 * });
 */
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

/**
 * Obtiene la instancia singleton del GameViewModel desde el contenedor.
 * 
 * @param container - Contenedor de Inversify configurado
 * @returns Instancia del GameViewModel para gestionar el estado del juego
 */
export function getGameViewModel(container: Container): GameViewModel {
  return container.get<GameViewModel>(TYPES.GameViewModel);
}

/**
 * Obtiene la configuración de la aplicación desde el contenedor.
 * 
 * @param container - Contenedor de Inversify configurado
 * @returns Objeto AppConfig con la configuración actual
 */
export function getAppConfig(container: Container): AppConfig {
  return container.get<AppConfig>(TYPES.AppConfig);
}

/**
 * Libera todos los bindings del contenedor.
 * Útil para cleanup en tests o al reiniciar la aplicación.
 * 
 * @param container - Contenedor de Inversify a limpiar
 */
export function clearContainer(container: Container): void {
  container.unbindAll();
}