import { Text, View, FlatList, StyleSheet, Alert, Pressable } from "react-native";
import { IndexVM } from "../viewmodels/IndexVM"

const usuarios = IndexVM.getPersonas()

export function Index() {

  const handlePress = (id: number) => {
    const persona = IndexVM.getPersonaById(id);
    if (persona) {
      // expo go
      Alert.alert(
        "Información de usuario",
        `${persona.nombre} ${persona.apellidos}`,
        [{ text: "OK" }]
      );
     // navegador web & expo go
      alert(`${persona.nombre} ${persona.apellidos}`);

    }
  };

  return (
    <FlatList
      data={usuarios}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable onPress={() => handlePress(item.id)}>
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