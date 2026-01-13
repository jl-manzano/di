import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PersonaUIModel } from '../UI/Models/PersonaUIModel';

interface PersonaListItemProps {
  persona: PersonaUIModel;
  onPress: () => void;
  onDelete: () => void;
}

export const PersonaListItem = ({ persona, onPress, onDelete }: PersonaListItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: persona.color }]}>
        <Text style={styles.initials}>{persona.initials}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>
          {persona.nombre} {persona.apellidos}
        </Text>
        <Text style={styles.info}>{persona.telefono}</Text>
        <Text style={styles.departamento}>{persona.nombreDepartamento}</Text>
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  departamento: {
    fontSize: 12,
    color: '#999',
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
