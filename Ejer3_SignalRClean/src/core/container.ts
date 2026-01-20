/**
 * CORE - Contenedor de Inyección de Dependencias (IoC)
 * Implementa Service Locator + Dependency Injection
 */

import { IMessageUseCases } from '../domain/interfaces/IMessageUseCases';
import { MessageUseCases } from '../domain/usecases/MessageUseCases';
import { ChatViewModel } from '../UI/viewmodels/ChatViewModel';
import { AppConfig, TYPES } from './types';

/**
 * Contenedor IoC para gestionar dependencias
 */
class Container {
  private services: Map<symbol, any> = new Map();

  /**
   * Registra un servicio singleton
   * El mismo objeto se reutiliza en cada resolución
   */
  registerSingleton<T>(type: symbol, instance: T): void {
    this.services.set(type, instance);
    console.log(`📦 Singleton registrado: ${type.toString()}`);
  }

  /**
   * Registra una factory para crear instancias
   * Se crea una nueva instancia en cada resolución
   */
  registerFactory<T>(type: symbol, factory: () => T): void {
    this.services.set(type, factory);
    console.log(`🏭 Factory registrada: ${type.toString()}`);
  }

  /**
   * Resuelve una dependencia del contenedor
   */
  resolve<T>(type: symbol): T {
    const service = this.services.get(type);
    
    if (!service) {
      throw new Error(`❌ Servicio no registrado: ${type.toString()}`);
    }

    // Si es una factory, ejecutarla para crear instancia
    if (typeof service === 'function') {
      return service();
    }

    // Si es un singleton, devolverlo directamente
    return service;
  }

  /**
   * Verifica si un servicio está registrado
   */
  has(type: symbol): boolean {
    return this.services.has(type);
  }

  /**
   * Limpia todos los servicios registrados
   */
  clear(): void {
    this.services.clear();
    console.log('🧹 Contenedor limpiado');
  }
}

// Instancia única del contenedor (Singleton)
export const container = new Container();

/**
 * Configura todas las dependencias de la aplicación
 * Este método se ejecuta una sola vez al inicio
 */
export function setupDependencies(config: AppConfig): void {
  console.log('🔧 Configurando inyección de dependencias...');
  console.log(`   Hub URL: ${config.hubUrl}`);
  console.log(`   Auto Reconnect: ${config.autoReconnect}`);
  console.log(`   Log Level: ${config.logLevel}`);

  // 1. Registrar configuración como singleton
  container.registerSingleton(TYPES.AppConfig, config);

  // 2. Registrar MessageUseCases como factory
  // Se crea una nueva instancia cada vez que se resuelve (si fuera necesario)
  container.registerFactory(
    TYPES.IMessageUseCases,
    () => {
      console.log('🏭 Creando instancia de MessageUseCases');
      return new MessageUseCases(config.hubUrl);
    }
  );

  // 3. Registrar ChatViewModel como singleton
  // Una sola instancia compartida en toda la app
  const messageUseCases = container.resolve<IMessageUseCases>(TYPES.IMessageUseCases);
  const chatViewModel = new ChatViewModel(messageUseCases);
  container.registerSingleton(TYPES.ChatViewModel, chatViewModel);

  console.log('✅ Inyección de dependencias configurada correctamente\n');
}

/**
 * Helper para obtener el ChatViewModel
 * Simplifica el acceso desde componentes
 */
export function getChatViewModel(): ChatViewModel {
  return container.resolve<ChatViewModel>(TYPES.ChatViewModel);
}

/**
 * Helper para obtener la configuración
 */
export function getAppConfig(): AppConfig {
  return container.resolve<AppConfig>(TYPES.AppConfig);
}

/**
 * Helper para obtener MessageUseCases
 * (Por si necesitas acceder directamente en algún momento)
 */
export function getMessageUseCases(): IMessageUseCases {
  return container.resolve<IMessageUseCases>(TYPES.IMessageUseCases);
}