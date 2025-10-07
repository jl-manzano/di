import { Text, View, Button } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello World</Text>
      <Button title="Mostrar alerta" onPress={() => alert('Hola mundo')} />

    </View>
  );
}
