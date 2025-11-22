import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TarjetaProducto } from "../app/components/TarjetaProducto";
import { CartIcon } from "../app/components/CartIcon";

export default function Index() {
  const [cartCount, setCartCount] = useState(0);

  // Productos de la tienda Real Betis
  const productos = [
    {
      id: "1",
      name: "Camiseta Real Betis",
      price: 99.99,
      image: require("../assets/images/camiseta.png"),
    },
    {
      id: "2",
      name: "Pantalón Oficial",
      price: 39.99,
      image: require("../assets/images/pantalones.png"),
    },
    {
      id: "3",
      name: "Zapatillas Futbol",
      price: 29.99,
      image: require("../assets/images/zapatillas.png"),
    },
    {
      id: "4",
      name: "Gorra Real Betis",
      price: 14.99,
      image: require("../assets/images/gorra.png"),
    },
  ];

  const handleAddToCart = () => {
    setCartCount((c) => c + 1);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tienda Real Betis Balompié</Text>
        <CartIcon count={cartCount} onPress={() => alert("Ir al carrito")} />
      </View>

      {/* Grid de productos con 2 productos por fila */}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          {productos.slice(0, 2).map((p) => (
            <TarjetaProducto
              key={p.id}
              name={p.name}
              price={p.price}
              image={p.image}
              onAddToCart={handleAddToCart}
            />
          ))}
        </View>
        <View style={styles.row}>
          {productos.slice(2, 4).map((p) => (
            <TarjetaProducto
              key={p.id}
              name={p.name}
              price={p.price}
              image={p.image}
              onAddToCart={handleAddToCart}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 14,
    backgroundColor: "#f2f2f5",
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 40,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
