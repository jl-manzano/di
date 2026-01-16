import 'reflect-metadata';
import '../Core/container';
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PersonasViewModel } from '../UI/ViewModels/PersonasViewModel';
import { DepartamentosViewModel } from '../UI/ViewModels/DepartamentosViewModel';

const personasVM = PersonasViewModel.getInstance();
const departamentosVM = DepartamentosViewModel.getInstance();

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  function initializeApp() {
    console.log('Cargando departamentos...');
    
    departamentosVM.loadDepartamentos()
      .then(() => {
        console.log('Departamentos cargados:', departamentosVM.departamentos);
        console.log('Cargando personas...');
        return personasVM.loadPersonas();
      })
      .then(() => {
        console.log('Personas cargadas:', personasVM.personas);
        console.log('Aplicación inicializada correctamente');
        setLoading(false);
        router.replace('/screens/WelcomeScreen');
      })
      .catch((err) => {
        console.error('Error al inicializar la aplicación:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      });
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Text style={styles.errorIconText}>⚠️</Text>
          </View>
          <Text style={styles.errorTitle}>Error al inicializar</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.logoLoader}>
            <Text style={styles.logoLoaderText}>HR</Text>
          </View>
          <ActivityIndicator size="large" color="#667eea" style={styles.spinner} />
          <Text style={styles.loadingText}>Cargando aplicación...</Text>
          <Text style={styles.loadingSubtext}>Preparando tu espacio de trabajo</Text>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  logoLoader: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoLoaderText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6c757d',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
    maxWidth: 300,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  errorIconText: {
    fontSize: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export { personasVM, departamentosVM };