/**
 * CORE - Contenedor de Inyección de Dependencias con InversifyJS
 */

import 'reflect-metadata';
import { Container } from 'inversify';
import { ISignalRConnection, SignalRConnection } from '../data/SignalRConnection';
import { IGameUseCases } from '../domain/interfaces/IGameUseCases';
import { GameUseCases } from '../domain/usecases/GameUseCases';
import { GameViewModel } from '../UI/viewmodels/GameViewModel';
import { AppConfig, TYPES } from './types';

/**
 * Contenedor IoC global (Singleton)
 */
export const container = new Container();

/**
 * Configura todas las dependencias de la aplicación
 * Este método se ejecuta una sola vez al inicio
 */
export function setupDependencies(config: AppConfig): void {
  console.log('🔧 Configurando inyección de dependencias con InversifyJS...');
  console.log(`   Hub URL: ${config.hubUrl}`);
  console.log(`   Auto Reconnect: ${config.autoReconnect}`);
  console.log(`   Log Level: ${config.logLevel}`);

  // 1. Registrar configuración como valor constante
  container.bind<AppConfig>(TYPES.AppConfig).toConstantValue(config);
  
  // 2. Registrar HubUrl como valor constante (para inyección directa)
  container.bind<string>(TYPES.HubUrl).toConstantValue(config.hubUrl);

  // 3. Registrar SignalRConnection (Data Layer) como Singleton
  // ⭐ ESTO ES LO QUE FALTA EN TU CÓDIGO ⭐
  container.bind<ISignalRConnection>(TYPES.ISignalRConnection)
    .to(SignalRConnection)
    .inSingletonScope();

  // 4. Registrar GameUseCases (Domain Layer) como Singleton
  // Recibe ISignalRConnection inyectado
  container.bind<IGameUseCases>(TYPES.IGameUseCases)
    .to(GameUseCases)
    .inSingletonScope();

  // 5. Registrar GameViewModel (Application Layer) como Singleton
  container.bind<GameViewModel>(TYPES.GameViewModel)
    .to(GameViewModel)
    .inSingletonScope();

  console.log('✅ Inyección de dependencias configurada correctamente\n');
  console.log('📦 Servicios registrados:');
  console.log(`   - ${TYPES.AppConfig.toString()}: AppConfig`);
  console.log(`   - ${TYPES.HubUrl.toString()}: HubUrl`);
  console.log(`   - ${TYPES.ISignalRConnection.toString()}: SignalRConnection (Data Layer)`);
  console.log(`   - ${TYPES.IGameUseCases.toString()}: GameUseCases (Domain Layer)`);
  console.log(`   - ${TYPES.GameViewModel.toString()}: GameViewModel (Application Layer)\n`);
  
  console.log('🏗️ Arquitectura en capas:');
  console.log('   Data Layer → SignalRConnection');
  console.log('   Domain Layer → GameUseCases (usa SignalRConnection)');
  console.log('   Application Layer → GameViewModel (usa GameUseCases)');
  console.log('   Presentation Layer → GameScreen (usa GameViewModel)\n');
}

/**
 * Helper para obtener el GameViewModel
 * Simplifica el acceso desde componentes
 */
export function getGameViewModel(): GameViewModel {
  return container.get<GameViewModel>(TYPES.GameViewModel);
}

/**
 * Helper para obtener la configuración
 */
export function getAppConfig(): AppConfig {
  return container.get<AppConfig>(TYPES.AppConfig);
}

/**
 * Helper para obtener GameUseCases
 */
export function getGameUseCases(): IGameUseCases {
  return container.get<IGameUseCases>(TYPES.IGameUseCases);
}

/**
 * Helper para obtener la conexión SignalR
 */
export function getSignalRConnection(): ISignalRConnection {
  return container.get<ISignalRConnection>(TYPES.ISignalRConnection);
}

/**
 * Limpia el contenedor (útil para testing)
 */
export function clearContainer(): void {
  container.unbindAll();
  console.log('🧹 Contenedor InversifyJS limpiado');
}