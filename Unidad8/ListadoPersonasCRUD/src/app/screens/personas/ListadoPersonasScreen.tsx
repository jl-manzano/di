import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';
import { PersonasViewModel } from '../../../UI/ViewModels/PersonasViewModel';
import { PersonaListItem } from '../../../Components/PeopleListItem';
import { PersonaUIModel } from '../../../UI/Models/PersonaUIModel';

const ListadoPersonasScreen = observer(function ListadoPersonasScreen() {
  const viewModel = PersonasViewModel.getInstance();
  const router = useRouter();

  useEffect(() => {
    viewModel.loadPersonas();
  }, []);

  const handleAddPersona = () => {
    viewModel.selectPersona(null);
    router.push('/screens/personas/EditarInsertarPersonaScreen');
  };

  const handleEditPersona = (persona: PersonaUIModel) => {
    viewModel.selectPersona(persona);
    router.push('/screens/personas/EditarInsertarPersonaScreen');
  };

  const handleDeletePersona = (persona: PersonaUIModel) => {
    console.log('handleDeletePersona llamado para:', persona.nombre);
    
    const confirmacion = window.confirm(
      `¿Está seguro que desea eliminar a ${persona.nombre} ${persona.apellidos}?`
    );
    
    if (confirmacion) {
      console.log('Usuario confirmó eliminación');
      performDelete(persona.id);
    } else {
      console.log('Eliminación cancelada');
    }
  };

  const performDelete = async (id: number) => {
    console.log('performDelete iniciado para id:', id);
    try {
      await viewModel.deletePersona(id);
      console.log('Persona eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar persona:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      window.alert(`Error: ${errorMessage}`);
    }
  };

  if (viewModel.isLoading && viewModel.personas.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando personal...</Text>
      </View>
    );
  }

  if (viewModel.error) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{viewModel.error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => viewModel.loadPersonas()}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con flecha SIEMPRE visible */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/')}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {viewModel.personas.length} persona{viewModel.personas.length !== 1 ? 's' : ''} registrada{viewModel.personas.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={viewModel.personas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PersonaListItem
            persona={item}
            onPress={() => handleEditPersona(item)}
            onDelete={() => handleDeletePersona(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No hay personas registradas</Text>
            <Text style={styles.emptySubtext}>Toca el botón + para agregar la primera persona</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleAddPersona}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

export default ListadoPersonasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backArrow: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 44,
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
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 36,
  },
});