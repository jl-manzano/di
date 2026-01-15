import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { PersonasViewModel } from '../../../UI/ViewModels/PersonasViewModel';
import { DepartamentosViewModel } from '../../../UI/ViewModels/DepartamentosViewModel';
import { Persona } from '../../../Domain/Entities/Persona';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export const EditarInsertarPersonaScreen = observer(function EditarInsertarPersonaScreen({ navigation }: Props) {
  const personasVM = PersonasViewModel.getInstance();
  const departamentosVM = DepartamentosViewModel.getInstance();
  
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fechaNac, setFechaNac] = useState(new Date());
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [foto, setFoto] = useState('');
  const [idDepartamento, setIdDepartamento] = useState(0);

  useEffect(() => {
    departamentosVM.loadDepartamentos();
    
    if (personasVM.personaSeleccionada) {
      setNombre(personasVM.personaSeleccionada.nombre);
      setApellidos(personasVM.personaSeleccionada.apellidos);
      setFechaNac(personasVM.personaSeleccionada.fechaNac);
      setDireccion(personasVM.personaSeleccionada.direccion);
      setTelefono(personasVM.personaSeleccionada.telefono);
      setFoto(personasVM.personaSeleccionada.foto);
      setIdDepartamento(personasVM.personaSeleccionada.idDepartamento);
    }
  }, []);

  const handleSave = async () => {
    if (!nombre || !apellidos || !telefono || idDepartamento === 0) {
      Alert.alert('Error', 'Los campos nombre, apellidos, teléfono y departamento son obligatorios');
      return;
    }

    try {
      const persona = new Persona(
        personasVM.personaSeleccionada?.id || 0,
        nombre,
        apellidos,
        fechaNac,
        direccion,
        telefono,
        foto,
        idDepartamento
      );

      if (personasVM.personaSeleccionada) {
        await personasVM.updatePersona(persona);
      } else {
        await personasVM.addPersona(persona);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la persona');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ingrese el nombre"
        />

        <Text style={styles.label}>Apellidos *</Text>
        <TextInput
          style={styles.input}
          value={apellidos}
          onChangeText={setApellidos}
          placeholder="Ingrese los apellidos"
        />

        <Text style={styles.label}>Teléfono *</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Ingrese el teléfono"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={direccion}
          onChangeText={setDireccion}
          placeholder="Ingrese la dirección"
        />

        <Text style={styles.label}>Foto (URL)</Text>
        <TextInput
          style={styles.input}
          value={foto}
          onChangeText={setFoto}
          placeholder="URL de la foto"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Departamento *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={idDepartamento}
            onValueChange={(value: number) => setIdDepartamento(value)}
          >
            <Picker.Item label="Seleccione un departamento" value={0} />
            {departamentosVM.departamentos.map((dept) => (
              <Picker.Item 
                key={dept.idDepartamento} 
                label={dept.nombreDepartamento} 
                value={dept.idDepartamento} 
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {personasVM.personaSeleccionada ? 'Actualizar' : 'Crear'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});