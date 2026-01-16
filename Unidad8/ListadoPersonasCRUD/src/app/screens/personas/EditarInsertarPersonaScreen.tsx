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
import { PersonasViewModel } from '../../../UI/ViewModels/PersonasViewModel';
import { DepartamentosViewModel } from '../../../UI/ViewModels/DepartamentosViewModel';
import { Persona } from '../../../Domain/Entities/Persona';

const EditarInsertarPersonaScreen = observer(function EditarInsertarPersonaScreen() {
  const router = useRouter();
  const personasVM = PersonasViewModel.getInstance();
  const departamentosVM = DepartamentosViewModel.getInstance();

  const personaSeleccionada = personasVM.personaSeleccionada;
  const isEditing = personaSeleccionada !== null;

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [idDepartamento, setIdDepartamento] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log('EditarInsertarPersonaScreen - isEditing:', isEditing);
    console.log('EditarInsertarPersonaScreen - personaSeleccionada:', personaSeleccionada);
    
    if (isEditing && personaSeleccionada) {
      setNombre(personaSeleccionada.nombre);
      setApellidos(personaSeleccionada.apellidos);
      setTelefono(personaSeleccionada.telefono);
      setDireccion(personaSeleccionada.direccion);
      setIdDepartamento(personaSeleccionada.idDepartamento);
    }
  }, [isEditing, personaSeleccionada]);

  const handleGuardar = async () => {
    console.log('handleGuardar iniciado');
    
    if (!nombre || !apellidos || !telefono) {
      window.alert('Por favor complete los campos obligatorios');
      return;
    }

    if (idDepartamento === 0) {
      window.alert('Por favor seleccione un departamento');
      return;
    }

    setIsSaving(true);
    console.log('Creando objeto Persona...');

    const persona = new Persona(
      isEditing ? personaSeleccionada!.id : 0,
      nombre,
      apellidos,
      isEditing ? personaSeleccionada!.fechaNac : new Date(),
      direccion,
      telefono,
      '',
      idDepartamento
    );

    console.log('Persona creada:', persona);

    try {
      if (isEditing) {
        console.log('Actualizando persona...');
        await personasVM.updatePersona(persona);
        console.log('Persona actualizada correctamente, navegando...');
      } else {
        console.log('Agregando persona...');
        await personasVM.addPersona(persona);
        console.log('Persona agregada correctamente, navegando...');
      }
      
      router.back();
    } catch (error) {
      console.error('Error al guardar persona:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      window.alert(`No se pudo ${isEditing ? 'actualizar' : 'agregar'} la persona: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Persona' : 'Nueva Persona'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isEditing ? 'Modifica los datos de la persona' : 'Completa la información'}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ingrese el nombre"
            placeholderTextColor="#adb5bd"
            editable={!isSaving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellidos <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={apellidos}
            onChangeText={setApellidos}
            placeholder="Ingrese los apellidos"
            placeholderTextColor="#adb5bd"
            editable={!isSaving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Ingrese el teléfono"
            placeholderTextColor="#adb5bd"
            keyboardType="phone-pad"
            editable={!isSaving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            value={direccion}
            onChangeText={setDireccion}
            placeholder="Ingrese la dirección"
            placeholderTextColor="#adb5bd"
            editable={!isSaving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Departamento <Text style={styles.required}>*</Text></Text>
          <View style={styles.picker}>
            {departamentosVM.departamentos.map((dep) => (
              <TouchableOpacity
                key={dep.idDepartamento}
                style={[
                  styles.pickerItem,
                  idDepartamento === dep.idDepartamento && styles.pickerItemSelected,
                ]}
                onPress={() => !isSaving && setIdDepartamento(dep.idDepartamento)}
                disabled={isSaving}
                activeOpacity={0.7}
              >
                <View style={styles.pickerContent}>
                  <Text style={styles.pickerIcon}>{dep.icon}</Text>
                  <Text
                    style={[
                      styles.pickerText,
                      idDepartamento === dep.idDepartamento && styles.pickerTextSelected,
                    ]}
                  >
                    {dep.nombreDepartamento}
                  </Text>
                </View>
                {idDepartamento === dep.idDepartamento && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
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

export default EditarInsertarPersonaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  form: {
    padding: 20,
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
  picker: {
    gap: 8,
  },
  pickerItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerItemSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#1a1a2e',
    fontWeight: '500',
  },
  pickerTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
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