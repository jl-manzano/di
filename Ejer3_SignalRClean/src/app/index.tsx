import React from 'react';
import ChatScreen from './screens/ChatScreen';
import { setupDependencies, getChatViewModel } from '../core/container';

// Configuración - CAMBIA ESTA URL por tu servidor
const HUB_URL = 'https://chatcleanjm-hjasgba2fravacdr.spaincentral-01.azurewebsites.net/chatHub';

// Configurar inyección de dependencias UNA SOLA VEZ
setupDependencies({
  hubUrl: HUB_URL,
  autoReconnect: true,
  logLevel: 'debug'
});

/**
 * Componente principal de la aplicación ChatClean
 * Arquitectura: Clean Architecture + MVVM
 */
export default function App() {
  // Obtener el ViewModel del contenedor IoC
  const chatViewModel = getChatViewModel();
  
  return <ChatScreen viewModel={chatViewModel} />;
}