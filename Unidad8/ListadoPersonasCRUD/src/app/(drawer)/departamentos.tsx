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
import { DepartamentosViewModel } from '../../UI/ViewModels/DepartamentosViewModel';
import { DepartamentoListItem } from '../../Components/DepartamentoListItem';

const DepartamentosScreen = observer(function DepartamentosScreen() {
  const router = useRouter();
  const departamentosVM = DepartamentosViewModel.getInstance();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await departamentosVM.loadDepartamentos();
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
      Alert.alert('Error', 'No se pudieron cargar los departamentos');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddDepartamento = () => {
    departamentosVM.selectDepartamento(null);
    router.push('/screens/departamentos/EditarInsertarDepartamento');
  };

  const handleEditDepartamento = (departamento: any) => {
    departamentosVM.selectDepartamento(departamento);
    router.push('/screens/departamentos/EditarInsertarDepartamento');
  };

  const handleDeleteDepartamento = (id: number, nombre: string) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar el departamento "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await departamentosVM.deleteDepartamento(id);
              Alert.alert('Éxito', 'Departamento eliminado correctamente');
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  if (departamentosVM.isLoading && departamentosVM.departamentos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando departamentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={departamentosVM.departamentos}
        keyExtractor={(item) => item.idDepartamento.toString()}
        renderItem={({ item }) => (
          <DepartamentoListItem
            departamento={item}
            onPress={() => handleEditDepartamento(item)}
            onDelete={() => handleDeleteDepartamento(item.idDepartamento, item.nombreDepartamento)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏢</Text>
            <Text style={styles.emptyTitle}>No hay departamentos registrados</Text>
            <Text style={styles.emptySubtitle}>Agrega tu primer departamento usando el botón +</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddDepartamento} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

export default DepartamentosScreen;

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