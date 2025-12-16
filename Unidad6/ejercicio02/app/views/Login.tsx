import React from 'react';
import { View, Text, TextInput, ImageBackground, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { BotonPersonalizado } from '../components/BotonPersonalizado';
import { ContenedorAbajo } from '../components/ContenedorAbajo';
import { Feather } from '@expo/vector-icons'; 

// Imágenes 
const imagenFondo = require('../../assets/images/chef.avif');
const logo = require('../../assets/images/logo.png');

// Obtenemos la altura de la pantalla para cálculos más dinámicos
const { height } = Dimensions.get('window');

export default function Login() {

  const handleLogin = () => {
    // Lógica de autenticación...
    Alert.alert("Acceso", "Intento de inicio de sesión. (Lógica de Auth pendiente)");
  };

  return (
    <ImageBackground 
      source={imagenFondo} 
      style={styles.fondo}
      resizeMode="cover" 
    >

      {/* Logo con texto estilizado */} 
      <View style={styles.logoArea}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logoImage} />
        </View>
        <View style={styles.appNameContainer}>
          <Text style={styles.foodText}>FOOD</Text>
          <Text style={styles.appText}>APP</Text>
        </View>
      </View>

      {/* ContenedorAbajo - Usamos un View intermedio para controlar el tamaño del área blanca */}
      <View style={styles.contenedorAbajoWrapper}>
        <ContenedorAbajo>
          <Text style={styles.titulo}>INGRESAR</Text>

          {/* Inputs */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#FFA500" style={styles.icon} />
              <TextInput 
                  placeholder="ejemplo@correo.com" 
                  style={styles.inputWithIcon} 
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Contraseña</Text>
            
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#FFA500" style={styles.icon} />
              <TextInput 
                  placeholder="********" 
                  secureTextEntry 
                  style={styles.inputWithIcon} 
                  placeholderTextColor="#999"
              />
            </View>
          </View>
          
          {/* Botón de Iniciar Sesión */}
          <View style={{ marginTop: 30 }}>
              <BotonPersonalizado label="INICIAR SESIÓN" onPress={handleLogin} color="#FF5733"/>
          </View>

          {/* Link a Registro */}
          <View style={styles.registroArea}>
              <Text style={{fontSize: 14}}>¿No tienes cuenta?</Text>
              <Link href="/views/Registro" asChild>
                  <Text style={styles.linkRegistro}>Regístrate aquí</Text>
              </Link>
          </View>

        </ContenedorAbajo>
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center',
  },
  logoArea: {
    position: 'absolute',
    top: '8%',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 10
  },
  logoImage: {
    width: 70,
    height: 70
  },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  foodText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FF5733',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 87, 51, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4
  },
  appText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFA500',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 165, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4
  },
  subtitleLine: {
    width: 60,
    height: 3,
    backgroundColor: '#FFA500',
    borderRadius: 2,
    marginBottom: 5
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    fontStyle: 'italic',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  contenedorAbajoWrapper: {
    width: '100%',
    height: height * 0.55,
    minHeight: 380,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  formGroup: {
      width: '100%', 
  },
  label: {
      fontWeight: '600',
      color: '#555',
      marginTop: 15,
      textAlign: 'left'
  },
  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5, 
    marginTop: 5,
  },
  icon: {
    marginRight: 10, 
  },
  inputWithIcon: {
      flex: 1, 
      height: 40,
      color: '#000',           
      fontSize: 16,
      paddingTop: 0, 
      paddingBottom: 0,
  },
  registroArea: {
    marginTop: 20, 
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5
  },
  linkRegistro: {
      color: '#FFA500', 
      fontWeight: 'bold',
      fontSize: 14,
      marginLeft: 5
  }
});