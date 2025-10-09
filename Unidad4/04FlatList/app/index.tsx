import { FlatList, Text, View, StyleSheet } from "react-native";

const usuarios = [
  { id: 1, nombre: 'Álvaro', apellidos: 'Valles' },
  { id: 2, nombre: 'Adrián', apellidos: 'San Miguel' },
  { id: 3, nombre: 'Pau', apellidos: 'López' },
  { id: 4, nombre: 'Héctor', apellidos: 'Bellerín' },
  { id: 5, nombre: 'Diego', apellidos: 'Llorente' },
  { id: 6, nombre: 'Natan', apellidos: 'de Souza' },
  { id: 7, nombre: 'Marc', apellidos: 'Bartra' },
  { id: 8, nombre: 'Ricardo', apellidos: 'Rodríguez' },
  { id: 9, nombre: 'Valentín', apellidos: 'Gómez' },
  { id: 10, nombre: 'Junior', apellidos: 'Firpo' },
  { id: 11, nombre: 'Ángel', apellidos: 'Ortiz' },
  { id: 12, nombre: 'Sergi', apellidos: 'Altimira' },
  { id: 13, nombre: 'Pablo', apellidos: 'Fornals' },
  { id: 14, nombre: 'Sofyan', apellidos: 'Amrabat' },
  { id: 15, nombre: 'Nicolás', apellidos: 'Deossa' },
  { id: 16, nombre: 'Giovani', apellidos: 'Lo Celso' },
  { id: 17, nombre: 'Marc', apellidos: 'Roca' },
  { id: 18, nombre: 'Isco', apellidos: 'Alarcón' },
  { id: 19, nombre: 'Antony', apellidos: 'dos Santos' },
  { id: 20, nombre: 'Chimy', apellidos: 'Ávila' },
  { id: 21, nombre: 'Ez', apellidos: 'Abde' },
  { id: 22, nombre: 'Cédric', apellidos: 'Bakambu' },
  { id: 23, nombre: 'Rodrigo', apellidos: 'Riquelme' },
  { id: 24, nombre: 'Cucho', apellidos: 'Hernández' },
  { id: 25, nombre: 'Aitor', apellidos: 'Ruibal' },
  { id: 26, nombre: 'Pablo', apellidos: 'García' },
];

export default function Index() {
  return (
    <FlatList
    data={usuarios}
    keyExtractor={(item) => item.id.toString()}
    renderItem = {({ item }) => (
      <View style={styles.item}>
        <Text style={styles.text}>{item.nombre} {item.apellidos}</Text>
      </View>
    )}
    />
  );
}

//#region styles
const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center'
  },
  text: {
    fontSize: 18
  }
})
//#endregion