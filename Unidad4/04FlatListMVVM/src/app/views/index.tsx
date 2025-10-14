import { Text, View, FlatList, StyleSheet, Alert, Pressable } from "react-native";
import { IndexVM } from "../viewmodels/IndexVM"

export function Index() {
  const vm = new IndexVM();

  return (
    <FlatList
      data={vm.Personas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable onPress={() => (vm.personaSeleccionada = item)}>
          <View style={styles.item}>
            <Text style={styles.text}>{item.nombre} {item.apellidos}</Text>
          </View>
        </Pressable>
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