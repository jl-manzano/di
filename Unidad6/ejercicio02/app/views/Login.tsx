import React from 'react';
import { View, Text, TextInput, ImageBackground, Image, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { BotonPersonalizado } from '../components/BotonPersonalizado';
import { ContenedorAbajo } from '../components/ContenedorAbajo';

// Imágenes 
const imagenFondo = require('../../assets/images/chefCocinando.avif');
const logo = require('../../assets/images/logo.png');

export default function Login() {

  return (
    <ImageBackground source={imagenFondo} style={styles.fondo}>
      
      {/* Logo*/} 
      <View style={styles.logoArea}>
        <Image source={logo} style={{ width: 100, height: 100 }} />
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>FOOD APP</Text>
      </View>


      {/* ContenedorAbajo*/}
      <ContenedorAbajo>
        <Text style={styles.titulo}>INGRESAR</Text>

        {/* Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
            <TextInput 
                placeholder="ejemplo@correo.com" 
                style={styles.input} 
                placeholderTextColor="#999" // Color del texto de ayuda (gris)
            />
          <Text style={styles.label}>Contraseña</Text>
            <TextInput 
                placeholder="********" 
                secureTextEntry 
                style={styles.input} 
                placeholderTextColor="#999"
          />
        </View>
  

        {/* Link a Registro */}
        <View style={{ marginTop: 15, alignItems: 'center' }}>
            <Text>No tienes cuenta?</Text>
            <Link href="/views/Registro" asChild>
                <BotonPersonalizado label="Ir a Registro" />
            </Link>
        </View>

      </ContenedorAbajo>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center'
  },
  input: {
      height: 40,              
      borderBottomWidth: 1,    
      borderBottomColor: '#ccc', 
      color: '#000',           
      fontSize: 16,
      width: '100%'     
  },
  logoArea: {
    position: 'absolute', // Para que esté arriba
    top: 100,
    alignItems: 'center'
  },
  titulo: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  formGroup: {
      width: '100%', 
  },
  label: {
      fontWeight: 'bold',
      color: 'orange',
      marginTop: 15,
      textAlign: 'left'
  }
});