import * as signalR from '@microsoft/signalr';
import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  user: string;
  message: string;
}

const ChatApp = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://chatjosemanzano-g2egbydcg7hhdxgp.spaincentral-01.azurewebsites.net/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          connection.on("ReceiveMessage", (user: string, message: string) => {
            setMessages(prevMessages => [...prevMessages, { user, message }]);
          });
        })
        .catch(e => console.log('Error de conexión: ', e));
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      if (messageInput.trim() === '') return;
      try {
        await connection.invoke("SendMessage", userInput || "Anónimo", messageInput);
        setMessageInput('');
      } catch (e) {
        console.error(e);
      }
    } else {
      alert("No hay conexión con el servidor.");
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={styles.messageBubble}>
      <Text style={styles.userLabel}>{item.user}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER ESTILO WEB */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SignalR Realtime Chat</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <View style={styles.chatCard}>
          {/* LISTA DE MENSAJES */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.scrollContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />

          {/* FOOTER / INPUTS */}
          <View style={styles.footer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Usuario</Text>
              <TextInput
                placeholder="Tu nombre..."
                value={userInput}
                onChangeText={setUserInput}
                style={styles.input}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Mensaje</Text>
              <TextInput
                placeholder="Escribe algo interesante..."
                value={messageInput}
                onChangeText={setMessageInput}
                style={[styles.input, { marginBottom: 15 }]}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Enviar Mensaje</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#6366f1', // Color primario del fondo
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  chatCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
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
    // Sombra suave para las burbujas
    shadowColor: "#000",
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
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default ChatApp;