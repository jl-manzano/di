import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';
import { PersonasViewModel } from '../../UI/ViewModels/PersonasViewModel';
import { PersonaListItem } from '../../Components/PeopleListItem';

const PersonasScreen = observer(function PersonasScreen() {
  const router = useRouter();
  const personasVM = PersonasViewModel.getInstance();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await personasVM.loadPersonas();
    } catch (error) {
      console.error('Error al cargar personas:', error);
      Alert.alert('Error', 'No se pudieron cargar las personas');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddPersona = () => {
    personasVM.selectPersona(null);
    router.push('/screens/personas/EditarInsertarPersonaScreen');
  };

  const handleEditPersona = (persona: any) => {
    personasVM.selectPersona(persona);
    router.push('/screens/personas/EditarInsertarPersonaScreen');
  };

  const handleDeletePersona = (id: number, nombre: string) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar a ${nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await personasVM.deletePersona(id);
              Alert.alert('Éxito', 'Persona eliminada correctamente');
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  if (personasVM.isLoading && personasVM.personas.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando personal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={personasVM.personas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PersonaListItem
            persona={item}
            onPress={() => handleEditPersona(item)}
            onDelete={() => handleDeletePersona(item.id, `${item.nombre} ${item.apellidos}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No hay personas registradas</Text>
            <Text style={styles.emptySubtitle}>Agrega tu primera persona usando el botón +</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddPersona} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

export default PersonasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});