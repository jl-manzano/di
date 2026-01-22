import 'reflect-metadata';
import '../Core/container';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#667eea',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Cargando...',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="screens/WelcomeScreen" 
        options={{ 
          title: 'Inicio',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="screens/personas/ListadoPersonasScreen" 
        options={{ 
          title: 'Personal',
          headerShown: false  // Ocultar porque el componente tiene su propio header
        }} 
      />
      <Stack.Screen 
        name="screens/personas/EditarInsertarPersonaScreen" 
        options={{ 
          title: 'Gestionar Persona',
          headerShown: false  // Ocultar porque el componente tiene su propio header
        }} 
      />
      <Stack.Screen 
        name="screens/departamentos/ListadoDepartamentos" 
        options={{ 
          title: 'Departamentos',
          headerShown: false  // Ocultar porque el componente tiene su propio header
        }} 
      />
    </Stack>
  );
}