import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { BotonPersonalizado } from '../components/BotonPersonalizado';
import { Link } from 'expo-router';

export default function Registro(){
    return (
      <View style={styles.container}>

        <Text style={styles.text}>Página de registro</Text>

        {/* Link a Login */}
        <Link href="/views/Login" asChild>
          <BotonPersonalizado label="Ir a Login" />
        </Link>    
      </View>
  );
}



const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: "#f2f2f2"
  },
  text: {
      fontWeight: 'bold',
      borderWidth: 2,
      borderColor: "bold",
      marginTop: 10,
      marginBottom: 10
  }
});