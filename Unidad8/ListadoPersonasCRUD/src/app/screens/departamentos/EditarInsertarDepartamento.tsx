import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';
import { DepartamentosViewModel } from '../../../UI/ViewModels/DepartamentosViewModel';
import { Departamento } from '../../../Domain/Entities/Departamento';

const EditarInsertarDepartamento = observer(function EditarInsertarDepartamento() {
  const router = useRouter();
  const departamentosVM = DepartamentosViewModel.getInstance();

  const departamentoSeleccionado = departamentosVM.departamentoSeleccionado;
  const isEditing = departamentoSeleccionado !== null;

  const [nombreDepartamento, setNombreDepartamento] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log('EditarInsertarDepartamento - isEditing:', isEditing);
    console.log('EditarInsertarDepartamento - departamentoSeleccionado:', departamentoSeleccionado);
    
    if (isEditing && departamentoSeleccionado) {
      setNombreDepartamento(departamentoSeleccionado.nombreDepartamento);
    }
  }, [isEditing, departamentoSeleccionado]);

  const handleGuardar = async () => {
    console.log('handleGuardar iniciado');
    
    if (!nombreDepartamento || nombreDepartamento.trim() === '') {
      window.alert('Por favor ingrese el nombre del departamento');
      return;
    }

    setIsSaving(true);
    console.log('Creando objeto Departamento...');

    const departamento = new Departamento(
      isEditing ? departamentoSeleccionado!.idDepartamento : 0,
      nombreDepartamento.trim()
    );

    console.log('Departamento creado:', departamento);

    try {
      if (isEditing) {
        console.log('Actualizando departamento...');
        await departamentosVM.updateDepartamento(departamento);
        console.log('Departamento actualizado correctamente, navegando...');
      } else {
        console.log('Agregando departamento...');
        await departamentosVM.addDepartamento(departamento);
        console.log('Departamento agregado correctamente, navegando...');
      }
      
      router.back();
    } catch (error) {
      console.error('Error al guardar departamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      window.alert(`No se pudo ${isEditing ? 'actualizar' : 'agregar'} el departamento: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Editar Departamento' : 'Nuevo Departamento'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isEditing ? 'Modifica el nombre del departamento' : 'Ingresa el nombre'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.iconPreview}>
          <View style={styles.iconCircle}>
            <Text style={styles.previewIcon}>🏢</Text>
          </View>
          <Text style={styles.iconLabel}>Icono del departamento</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Nombre del Departamento <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={nombreDepartamento}
            onChangeText={setNombreDepartamento}
            placeholder="Ej: Recursos Humanos"
            placeholderTextColor="#adb5bd"
            editable={!isSaving}
            autoCapitalize="words"
          />
          <Text style={styles.hint}>Ingresa un nombre descriptivo para el departamento</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton, isSaving && styles.buttonDisabled]} 
            onPress={handleGuardar}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>{isEditing ? '💾' : '➕'}</Text>
                <Text style={styles.buttonText}>
                  {isEditing ? 'Actualizar' : 'Guardar'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.back()}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonIcon}>✕</Text>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
});

export default EditarInsertarDepartamento;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 24,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backArrow: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  form: {
    padding: 20,
  },
  iconPreview: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  previewIcon: {
    fontSize: 48,
  },
  iconLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a2e',
  },
  required: {
    color: '#dc3545',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#1a1a2e',
  },
  hint: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 6,
  },
  buttonGroup: {
    marginTop: 12,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  buttonDisabled: {
    backgroundColor: '#adb5bd',
    opacity: 0.6,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#6c757d',
  },
});