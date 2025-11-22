import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { CustomButton } from "./CustomButton";

interface Props {
  name: string;
  price: number;
  image: any;
  onAddToCart: () => void;
}

export function TarjetaProducto({ name, price, image, onAddToCart }: Props) {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} resizeMode="contain" />

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.price}>€{price.toFixed(2)} EUR</Text>

      <CustomButton
        label="Añadir al Carrito"
        color="#007bff"
        onPress={onAddToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 120,
    height: 120,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  price: {
    fontSize: 14,
    color: "#555",
  },
});