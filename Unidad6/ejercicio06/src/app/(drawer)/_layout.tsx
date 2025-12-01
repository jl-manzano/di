// src/app/(drawer)/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#fff",
          width: 240,
        },
        drawerActiveTintColor: '#007BFF',
        drawerInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007BFF',
        },
        headerTitleStyle: {
          color: 'white',
          fontSize: 20,
        },
      }}
    >
      {/* Pantalla de Inicio que llevará a Tabs */}
      <Drawer.Screen
        name="tabs"
        options={{
          title: "Inicio",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Pantalla de Perfil */}
      <Drawer.Screen
        name="profile"
        options={{
          title: "Perfil",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Pantalla de Configuración */}
      <Drawer.Screen
        name="settings"
        options={{
          title: "Configuración",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
