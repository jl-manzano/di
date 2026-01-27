/**
 * APP - Punto de entrada principal
 * 
 * Configura la inyección de dependencias con InversifyJS
 * y renderiza la pantalla principal del juego
 */

import 'reflect-metadata'; // IMPORTANTE: Debe ser la primera importación
import React from 'react';
import GameScreen from '../UI/screens/GameScreen';
import { setupDependencies, getGameViewModel } from '../core/container';

// ==========================================
// CONFIGURACIÓN - CAMBIA ESTA URL
// ==========================================
const HUB_URL = 'http://localhost:5251/gameHub';
// CONFIGURAR INYECCIÓN DE DEPENDENCIAS
// ==========================================
// Esto se ejecuta UNA SOLA VEZ al inicio de la aplicación
setupDependencies({
  hubUrl: HUB_URL,
  autoReconnect: true,
  logLevel: 'debug'
});

/**
 * Componente principal de la aplicación TicTacToe
 * 
 * Arquitectura implementada:
 * - Clean Architecture (capas bien definidas)
 * - MVVM (Model-View-ViewModel)
 * - Dependency Injection con InversifyJS
 * - Reactive state management con MobX
 */
export default function App() {
  // Obtener el ViewModel del contenedor IoC de InversifyJS
  // Esta instancia es un Singleton compartido en toda la app
  const gameViewModel = getGameViewModel();
  
  console.log('🎨 App renderizada con InversifyJS');
  
  return <GameScreen viewModel={gameViewModel} />;
}