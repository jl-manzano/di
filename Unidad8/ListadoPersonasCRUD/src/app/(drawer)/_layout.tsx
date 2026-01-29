import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: '#667eea',
          elevation: 4,
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 300,               // ← Drawer más ancho
        },
        drawerActiveTintColor: '#667eea',
        drawerInactiveTintColor: '#6c757d',
        drawerActiveBackgroundColor: 'rgba(102, 126, 234, 0.15)',
        drawerItemStyle: {
          borderRadius: 16,         // ← Bordes más redondeados
          marginHorizontal: 12,     // ← Más margen horizontal
          marginVertical: 12,       // ← MÁS ESPACIO entre items
          paddingVertical: 12,      // ← Más padding vertical
          paddingHorizontal: 16,    // ← Más padding horizontal
          height: 64,               // ← Items más altos
        },
        drawerLabelStyle: {
          fontSize: 17,             // ← Texto más grande
          fontWeight: '600',
          marginLeft: -12,
        },
        drawerContentContainerStyle: {
          paddingTop: 24,           // ← Más espacio superior
          paddingBottom: 24,
        },
      }}
    >
      <Drawer.Screen
        name="personas"
        options={{
          drawerLabel: 'Personal',
          title: 'Personal',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people" size={26} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="departamentos"
        options={{
          drawerLabel: 'Departamentos',
          title: 'Departamentos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="business" size={26} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}