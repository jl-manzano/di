import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DepartamentoUIModel } from '../UI/Models/DepartamentoUIModel';

interface DepartamentoListItemProps {
  departamento: DepartamentoUIModel;
  onPress: () => void;
  onDelete: () => void;
}

export function DepartamentoListItem({ departamento, onPress, onDelete }: DepartamentoListItemProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.mainContent}
        onPress={onPress} 
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: departamento.color }]}>
          <Text style={styles.icon}>{departamento.icon}</Text>
          <View style={styles.iconOverlay} />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.name}>{departamento.nombreDepartamento}</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => {
          console.log('Delete button pressed for:', departamento.nombreDepartamento);
          onDelete();
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  content: {
    flex: 1,
  },
  name: {
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
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 20,
  },
});