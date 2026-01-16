import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PersonaUIModel } from '../UI/Models/PersonaUIModel';

interface PersonaListItemProps {
  persona: PersonaUIModel;
  onPress: () => void;
  onDelete: () => void;
}

export function PersonaListItem({ persona, onPress, onDelete }: PersonaListItemProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.mainContent}
        onPress={onPress} 
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: persona.color }]}>
          <Text style={styles.initials}>{persona.initials}</Text>
          <View style={styles.avatarOverlay} />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.name}>
            {persona.nombre} {persona.apellidos}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📞</Text>
            <Text style={styles.info}>{persona.telefono}</Text>
          </View>
          <View style={styles.departmentBadge}>
            <Text style={styles.departmentText}>{persona.nombreDepartamento}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => {
          console.log('Delete button pressed for:', persona.nombre);
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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  initials: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1a1a2e',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  info: {
    fontSize: 14,
    color: '#6c757d',
  },
  departmentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  departmentText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
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