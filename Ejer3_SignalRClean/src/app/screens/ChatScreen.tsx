import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatViewModel } from '../../UI/viewmodels/ChatViewModel';
import { clsMensajeUsuario } from '../../domain/entities/clsMensajeUsuario';

interface ChatScreenProps {
  viewModel: ChatViewModel;
}

const ChatScreen: React.FC<ChatScreenProps> = observer(({ viewModel }) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    viewModel.initialize();
    return () => {
      viewModel.disconnect();
    };
  }, []);

  useEffect(() => {
    if (viewModel.errorMessage) {
      Alert.alert('Error', viewModel.errorMessage);
    }
  }, [viewModel.errorMessage]);

  useEffect(() => {
    if (viewModel.messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [viewModel.messages.length]);

  const handleSendMessage = () => {
    viewModel.sendMessage();
  };

  const renderItem = ({ item }: { item: clsMensajeUsuario }) => (
    <View style={styles.messageBubble}>
      <Text style={styles.userLabel}>
        {item.usuario || 'Anónimo'}
      </Text>
      <Text style={styles.messageText}>
        {item.mensaje || ''}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        No hay mensajes aún{'\n'}
        ¡Sé el primero en escribir! 💬
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>ChatClean</Text>
        <Text style={styles.headerSubtitle}>Clean Architecture + MVVM</Text>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: viewModel.isConnected ? '#22c55e' : '#ef4444' }
        ]}>
          <Text style={styles.statusText}>
            {viewModel.isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </Text>
        </View>
        {viewModel.messageCount > 0 && (
          <Text style={styles.messageCount}>
            {viewModel.messageCount} mensaje{viewModel.messageCount !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.chatCard}>
          <FlatList
            ref={flatListRef}
            data={viewModel.messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.scrollContent}
            ListEmptyComponent={renderEmptyState}
          />

          <View style={styles.footer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Usuario</Text>
              <TextInput
                placeholder="Tu nombre..."
                value={viewModel.userInput}
                onChangeText={(text) => viewModel.setUserInput(text)}
                style={styles.input}
                placeholderTextColor="#94a3b8"
                editable={viewModel.isConnected}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Mensaje</Text>
              <TextInput
                placeholder="Escribe algo interesante..."
                value={viewModel.messageInput}
                onChangeText={(text) => viewModel.setMessageInput(text)}
                style={[styles.input, { marginBottom: 15 }]}
                placeholderTextColor="#94a3b8"
                onSubmitEditing={handleSendMessage}
                editable={viewModel.isConnected}
                multiline
                numberOfLines={2}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                !viewModel.isConnected && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!viewModel.isConnected}
            >
              <Text style={styles.sendButtonText}>
                {viewModel.isConnected ? 'Enviar Mensaje' : 'Conectando...'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#6366f1',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#e0e7ff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 8,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  messageCount: {
    color: '#e0e7ff',
    fontSize: 11,
    marginTop: 6,
  },
  chatCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  messageBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    marginBottom: 12,
    maxWidth: '85%',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6366f1',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  inputWrapper: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    color: '#1e293b',
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatScreen;