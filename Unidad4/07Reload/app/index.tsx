import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Pressable } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReload = () => {
    setLoading(true);
    setSuccess(false);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000)
  }

  return (
    <View style={styles.contenedor}>
      <Pressable style={styles.boton} onPress={handleReload}>
        <Ionicons name="reload" size={30} color="white" />
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.indicator} />
      ) : (
        <Text style={styles.success}>{'Cargado con éxito'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  boton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20
  },
  success: {
    marginTop: 20,
    fontSize: 18,
    color: 'green'
  }

})