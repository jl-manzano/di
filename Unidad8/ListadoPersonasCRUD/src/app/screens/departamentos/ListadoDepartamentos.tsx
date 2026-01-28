import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';
import { DepartamentosViewModel } from '../../../UI/ViewModels/DepartamentosViewModel';
import { DepartamentoUIModel } from '../../../UI/Models/DepartamentoUIModel';

const ListadoDepartamentos = observer(function ListadoDepartamentos() {
  const viewModel = DepartamentosViewModel.getInstance();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    viewModel.loadDepartamentos();
  }, []);

  const handleAddDepartamento = () => {
    viewModel.selectDepartamento(null);
    router.push('/screens/departamentos/EditarInsertarDepartamento');
  };

  const handleEditDepartamento = (departamento: DepartamentoUIModel) => {
    viewModel.selectDepartamento(departamento);
    router.push('/screens/departamentos/EditarInsertarDepartamento');
  };

  const handleDeleteDepartamento = (departamento: DepartamentoUIModel) => {
    console.log('handleDeleteDepartamento llamado para:', departamento.nombreDepartamento);
    
    const confirmacion = window.confirm(
      `¿Está seguro que desea eliminar el departamento "${departamento.nombreDepartamento}"?`
    );
    
    if (confirmacion) {
      console.log('Usuario confirmó eliminación');
      performDelete(departamento.idDepartamento);
    } else {
      console.log('Eliminación cancelada');
    }
  };

  const performDelete = async (id: number) => {
    console.log('performDelete iniciado para id:', id);
    try {
      await viewModel.deleteDepartamento(id);
      console.log('Departamento eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar departamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      window.alert(`Error: ${errorMessage}`);
    }
  };

  // Filtrar departamentos basándose en la búsqueda
  const filteredDepartamentos = viewModel.departamentos.filter(dep => 
    dep.nombreDepartamento.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (viewModel.isLoading && viewModel.departamentos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando departamentos...</Text>
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
            onPress={() => viewModel.loadDepartamentos()}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderDepartamento = ({ item }: { item: DepartamentoUIModel }) => (
    <View style={styles.departamentoCard}>
      <TouchableOpacity 
        style={styles.mainContent}
        onPress={() => handleEditDepartamento(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Text style={styles.icon}>{item.icon}</Text>
          <View style={styles.iconOverlay} />
        </View>
        <View style={styles.departamentoInfo}>
          <Text style={styles.departamentoNombre}>{item.nombreDepartamento}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => {
          console.log('Botón de eliminar presionado');
          handleDeleteDepartamento(item);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/')}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Departamentos</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {filteredDepartamentos.length} departamento{filteredDepartamentos.length !== 1 ? 's' : ''}
          {searchQuery && ` (filtrado${filteredDepartamentos.length !== 1 ? 's' : ''})`}
        </Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar departamento..."
            placeholderTextColor="#adb5bd"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FlatList
        data={filteredDepartamentos}
        keyExtractor={(item) => item.idDepartamento.toString()}
        renderItem={renderDepartamento}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {searchQuery ? '🔍' : '🏢'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'No se encontraron departamentos' 
                : 'No hay departamentos registrados'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery 
                ? `No hay resultados para "${searchQuery}"` 
                : 'Toca el botón + para agregar el primer departamento'}
            </Text>
          </View>
        }
      />

      {/* Botón flotante para agregar */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleAddDepartamento}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

export default ListadoDepartamentos;

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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a2e',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 18,
    color: '#6c757d',
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
  departamentoCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: {
    fontSize: 28,
    zIndex: 1,
  },
  departamentoInfo: {
    flex: 1,
  },
  departamentoNombre: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  deleteButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe5e5',
    borderRadius: 12,
  },
  deleteText: {
    fontSize: 20,
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