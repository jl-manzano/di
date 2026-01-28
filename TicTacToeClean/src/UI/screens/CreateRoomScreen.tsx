import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Pressable
} from 'react-native';

interface CreateRoomScreenProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (roomName: string) => void;
}

const CreateRoomScreen = ({ visible, onClose, onCreate }: CreateRoomScreenProps) => {
  const [roomName, setRoomName] = useState('');
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const styles = createStyles(width, height, isSmallScreen);

  const handleCreate = () => {
    if (roomName.trim()) {
      onCreate(roomName.trim());
      setRoomName('');
    }
  };

  const handleCancel = () => {
    setRoomName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable
          style={styles.backdrop}
          onPress={handleCancel}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.title}>Crear Nueva Sala</Text>
                <Text style={styles.subtitle}>
                  Elige un nombre para tu sala de juego
                </Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Nombre de la sala"
                placeholderTextColor="#94a3b8"
                value={roomName}
                onChangeText={setRoomName}
                maxLength={30}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleCreate}
              />

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.createButton,
                    !roomName.trim() && styles.createButtonDisabled
                  ]}
                  onPress={handleCreate}
                  disabled={!roomName.trim()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.createButtonText}>Crear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const createStyles = (width: number, height: number, isSmallScreen: boolean) => {
  const modalPadding = isSmallScreen ? 16 : 20;
  const modalWidth = Math.min(width * 0.9, 380);
  
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backdrop: {
      flex: 1,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modal: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: modalPadding * 1.5,
      width: modalWidth,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    modalHeader: {
      marginBottom: 20,
    },
    title: {
      fontSize: isSmallScreen ? 20 : 22,
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: 6,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 13,
      color: '#64748b',
      textAlign: 'center',
      lineHeight: 18,
    },
    input: {
      backgroundColor: '#f1f5f9',
      borderRadius: 12,
      padding: 14,
      fontSize: 15,
      color: '#1e293b',
      marginBottom: 20,
      borderWidth: 2,
      borderColor: 'transparent',
      fontWeight: '500',
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
    },
    button: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 13,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: '#e2e8f0',
    },
    cancelButtonText: {
      color: '#64748b',
      fontSize: 15,
      fontWeight: '600',
    },
    createButton: {
      backgroundColor: '#6366f1',
      shadowColor: '#6366f1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 4,
    },
    createButtonDisabled: {
      backgroundColor: '#94a3b8',
      opacity: 0.5,
      shadowOpacity: 0,
      elevation: 0,
    },
    createButtonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
    },
  });
};

export default CreateRoomScreen;