/**
 * @file CreateRoomScreen.tsx
 * @summary Componente modal para crear nuevas salas de juego.
 * 
 * Presenta un formulario modal que permite al usuario introducir
 * el nombre de una nueva sala. Incluye validación en tiempo real,
 * feedback visual del estado del botón y manejo de eventos de teclado.
 * 
 * Características:
 * - Modal con overlay semi-transparente
 * - Input con validación de longitud mínima (3 caracteres)
 * - Botón de crear deshabilitado hasta cumplir validación
 * - Cierre al tocar fuera del modal o botón cancelar
 * - Soporte para KeyboardAvoidingView en iOS/Android
 */

import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface CreateRoomScreenProps {
  /** Controla la visibilidad del modal */
  visible: boolean;
  /** Callback al cerrar el modal (cancelar o tocar fuera) */
  onClose: () => void;
  /** Callback al crear la sala con el nombre validado */
  onCreate: (roomName: string) => void | Promise<void>;
}

/**
 * Modal para crear una nueva sala de juego.
 * Valida que el nombre tenga al menos 3 caracteres antes de permitir la creación.
 */
const CreateRoomScreen = ({ visible, onClose, onCreate }: CreateRoomScreenProps) => {
  const [roomName, setRoomName] = useState('');

  /**
   * Maneja el intento de crear una sala.
   * Valida el nombre y llama al callback onCreate si es válido.
   */
  const handleCreate = async () => {
    const trimmed = roomName.trim();

    if (trimmed.length < 3) {
      Alert.alert(
        'Nombre demasiado corto',
        'El nombre de la sala debe tener al menos 3 caracteres.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await onCreate(trimmed);

      setRoomName('');
    } catch {
    }
  };

  /**
   * Maneja la cancelación, limpiando el estado y cerrando el modal.
   */
  const handleCancel = () => {
    setRoomName('');
    onClose();
  };

  /** Indica si el nombre cumple la validación mínima */
  const isValid = roomName.trim().length >= 3;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleCancel}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modal}>
              <Text style={styles.title}>Crear Nueva Sala</Text>
              <Text style={styles.subtitle}>Elige un nombre para tu sala de juego</Text>

              <TextInput
                style={styles.input}
                placeholder="Nombre de la sala"
                placeholderTextColor="#94a3b8"
                value={roomName}
                onChangeText={setRoomName}
                maxLength={30}
                autoFocus
              />

              <Text style={styles.hint}>Mínimo 3 caracteres.</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.createButton,
                    !isValid && styles.createButtonDisabled
                  ]}
                  onPress={handleCreate}
                  disabled={!isValid}
                >
                  <Text style={styles.createButtonText}>Crear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backdrop: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  hint: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  actions: { flexDirection: 'row', gap: 12 },
  button: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelButton: { backgroundColor: '#e2e8f0' },
  cancelButtonText: { color: '#64748b', fontSize: 16, fontWeight: '600' },
  createButton: { backgroundColor: '#6366f1' },
  createButtonDisabled: { opacity: 0.6 },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default CreateRoomScreen;