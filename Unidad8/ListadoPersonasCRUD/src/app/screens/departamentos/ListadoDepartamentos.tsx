import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DepartamentosViewModel } from '../../../UI/ViewModels/DepartamentosViewModel';
import { DepartamentoListItem } from '../../../Components/DepartamentoListItem';
import { DepartamentoUIModel } from '../../../UI/Models/DepartamentoUIModel';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const ListadoDepartamentosScreen = observer(function ListadoDepartamentosScreen({ navigation }: Props) {
  const viewModel = DepartamentosViewModel.getInstance();

  useEffect(() => {
    viewModel.loadDepartamentos();
  }, []);

  const handleAddDepartamento = () => {
    viewModel.selectDepartamento(null);
    navigation.navigate('EditarInsertarDepartamento');
  };

  const handleEditDepartamento = (departamento: DepartamentoUIModel) => {
    viewModel.selectDepartamento(departamento);
    navigation.navigate('EditarInsertarDepartamento');
  };

  if (viewModel.isLoading && viewModel.departamentos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (viewModel.error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{viewModel.error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => viewModel.loadDepartamentos()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={viewModel.departamentos}
        keyExtractor={(item) => item.idDepartamento.toString()}
        renderItem={({ item }) => (
          <DepartamentoListItem
            departamento={item}
            onPress={() => handleEditDepartamento(item)}
            onDelete={() => viewModel.deleteDepartamento(item.idDepartamento)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay departamentos registrados</Text>
        }
      />
      
      <TouchableOpacity style={styles.fab} onPress={handleAddDepartamento}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});