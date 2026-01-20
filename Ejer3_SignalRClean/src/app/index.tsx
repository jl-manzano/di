import React from 'react';
import ChatScreen from './screens/ChatScreen';
import { ChatViewModel } from '../UI/viewmodels/ChatViewModel';
import { MessageUseCases } from '../domain/usecases/MessageUseCases';

// Configuración - CAMBIA ESTA URL por tu servidor
const HUB_URL = 'https://chatcleanjm-hjasgba2fravacdr.spaincentral-01.azurewebsites.net/chatHub';
// Para Azure: 'https://tu-app.azurewebsites.net/chatHub'

// Inyección de dependencias (DI)
const messageUseCases = new MessageUseCases(HUB_URL);
const chatViewModel = new ChatViewModel(messageUseCases);

/**
 * Componente principal de la aplicación ChatClean
 * Arquitectura: Clean Architecture + MVVM
 */
export default function App() {
  return <ChatScreen viewModel={chatViewModel} />;
}