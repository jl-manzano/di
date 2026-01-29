import 'reflect-metadata';
import '../Core/container';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="screens/WelcomeScreen" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="(drawer)" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="screens/personas/EditarInsertarPersonaScreen" 
        options={{ 
          title: 'Gestionar Persona',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="screens/departamentos/EditarInsertarDepartamento" 
        options={{ 
          title: 'Gestionar Departamento',
          headerShown: false
        }} 
      />
    </Stack>
  );
}