import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DepartamentoUIModel } from '../UI/Models/DepartamentoUIModel'; // Importa la entidad Departamento

interface DepartamentoListItemProps {
  departamento: DepartamentoUIModel;
  onPress: () => void;
  onDelete: () => void;
}

export const DepartamentoListItem = ({ departamento, onPress, onDelete }: DepartamentoListItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: departamento.color }]}>
        <Text style={styles.icon}>{departamento.icon}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{departamento.nombreDepartamento}</Text>
      </View>
      
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 20,
    color: '#ff4444',
  },
});
