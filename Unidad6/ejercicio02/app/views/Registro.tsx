import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BotonPersonalizado } from '../components/BotonPersonalizado';
import { Link } from 'expo-router';

export default function Registro(){
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Página de registro</Text>

          {/* Link a Login */}
          <Link href="/views/Login" asChild>
            <BotonPersonalizado label="Ir a Login" color="#FF5733" />
          </Link>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  }
});