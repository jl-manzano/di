import { View, StyleSheet, Alert } from "react-native";
import { BotonPersonalizado } from "./componentes/BotonPersonalizado";

export default function Index() {
  return (
    <View style={styles.container}>
      <BotonPersonalizado texto="Inicio" onPress={() => alert(`Inicio`)} />
      <BotonPersonalizado texto="Perfil" onPress={() => alert(`Perfil`)} />
      <BotonPersonalizado texto="Ajustes" onPress={() => alert(`Ajustes`)} />
      <BotonPersonalizado texto="Salir" onPress={() => alert(`Salir`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
