/**
 * CORE - Contenedor de Inyección de Dependencias con InversifyJS
 */

import 'reflect-metadata';
import { Container } from 'inversify';
import { IMessageUseCases } from '../domain/interfaces/IMessageUseCases';
import { MessageUseCases } from '../domain/usecases/MessageUseCases';
import { ChatViewModel } from '../UI/viewmodels/ChatViewModel';
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

  // 3. Registrar MessageUseCases como Singleton
  // Bind a la interfaz para cumplir con Dependency Inversion Principle
  container.bind<IMessageUseCases>(TYPES.IMessageUseCases)
    .to(MessageUseCases)
    .inSingletonScope();

  // 4. Registrar ChatViewModel como Singleton
  container.bind<ChatViewModel>(TYPES.ChatViewModel)
    .to(ChatViewModel)
    .inSingletonScope();

  console.log('✅ Inyección de dependencias configurada correctamente con InversifyJS\n');
  console.log('📦 Servicios registrados:');
  console.log(`   - ${TYPES.AppConfig.toString()}: AppConfig`);
  console.log(`   - ${TYPES.HubUrl.toString()}: HubUrl`);
  console.log(`   - ${TYPES.IMessageUseCases.toString()}: MessageUseCases`);
  console.log(`   - ${TYPES.ChatViewModel.toString()}: ChatViewModel\n`);
}

/**
 * Helper para obtener el ChatViewModel
 * Simplifica el acceso desde componentes
 */
export function getChatViewModel(): ChatViewModel {
  return container.get<ChatViewModel>(TYPES.ChatViewModel);
}

/**
 * Helper para obtener la configuración
 */
export function getAppConfig(): AppConfig {
  return container.get<AppConfig>(TYPES.AppConfig);
}

/**
 * Helper para obtener MessageUseCases
 */
export function getMessageUseCases(): IMessageUseCases {
  return container.get<IMessageUseCases>(TYPES.IMessageUseCases);
}

/**
 * Limpia el contenedor (útil para testing)
 */
export function clearContainer(): void {
  container.unbindAll();
  console.log('🧹 Contenedor InversifyJS limpiado');
}