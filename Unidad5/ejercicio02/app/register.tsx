import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function Register() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Nuevo usuario",
          headerBackVisible: true,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Página de registro</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa", // Lighter background for consistency
  },
  text: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
});
