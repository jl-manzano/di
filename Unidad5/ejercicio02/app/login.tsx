import { View, Text, StyleSheet, Link } from "react-native";
import { router } from "expo-router";
import RoundedButton from "./components/RoundedButton";
import RegisterCard from "./components/RegisterCard";

export default function Login() {
  return (
    <View style={styles.container}>
      <RegisterCard>
        <Text style={styles.title}>Login</Text>
        <RoundedButton text="Entrar" onPress={() => router.push("/home")} />
        <Link href="/register" style={styles.link}>
          ¿No tienes cuenta? Regístrate
        </Link>
      </RegisterCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "700",
    color: "#333",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
  },
});
