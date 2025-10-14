import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text } from "react-native";

export default function Index() {

  const [texto, setTexto] = useState<string>('');

  return (
    <View style={styles.contenedor}>
      <TextInput
        style={styles.input}
        placeholder='Escribe algo aquí...'
        onChangeText={newText => setTexto(newText)}
        value={texto}
      />
      <Text style={styles.displayText}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingLeft: 10
  },
  displayText: {
    fontSize: 20,
  },
})