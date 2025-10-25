import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { container } from "../../core/container";
import { TYPES } from "../../core/types";
import { Persona } from "../../domain/entities/Persona";
import { PeopleListVM } from "../viewmodels/PeopleListVM";


export default function PeopleList() {
 
  const viewModel = container.get<PeopleListVM>(TYPES.IndexVM)

  const renderItem = ({ item }: { item: Persona }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.nombre} {item.apellidos}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Listado de Personas</Text>
      <FlatList
        data={viewModel.personasList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <Text style={styles.textoVacio}>No hay personas registradas</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // estilo para el contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: "#d0f7e7ff", // fondo verde claro (similar al azul suave)
    paddingHorizontal: 20, // espacio a los lados
    paddingTop: 40, // espacio superior para no sobreponerse con la barra de estado
    justifyContent: "center", // centra el contenido verticalmente
  },

  // estilo para el título de la pantalla
  titulo: {
    fontSize: 26, // tamaño grande para el título
    fontWeight: "bold", // título en negrita
    marginBottom: 20, // espacio debajo del título
    textAlign: "center", // centra el título
    color: "#2C3E50", // color azul oscuro para el título
  },

  // estilo para cada elemento (persona) en la lista
  item: {
    backgroundColor: "#FFFFFF", // fondo blanco para cada card
    padding: 18, // espacio dentro de cada card
    marginVertical: 10, // espacio entre los cards
    borderRadius: 12, // bordes redondeados para los cards
    shadowColor: "#000", // color de la sombra
    shadowOpacity: 0.1, // opacidad de la sombra
    shadowRadius: 5, // radio de la sombra (qué tan difusa es)
    elevation: 5, // sombra en android
    width: 300, // ancho fijo para todos los elementos
    height: 60, // alto fijo para todos los elementos
    alignSelf: "center", // centra los elementos horizontalmente en la pantalla
    justifyContent: "center", // centra el texto dentro de cada card
    borderLeftWidth: 5, // borde izquierdo para resaltar los cards
    borderLeftColor: "#2ecc71", // color verde para el borde izquierdo
  },

  // estilo para el texto dentro de cada card
  itemText: {
    fontSize: 18, // tamaño del texto
    color: "#34495E", // color gris oscuro para el texto
    textAlign: "center", // centra el texto dentro de cada item
  },

  // estilo para el separador entre los elementos
  separator: {
    height: 10, // altura del espacio entre elementos
  },

  // estilo para el texto que se muestra cuando no hay personas
  textoVacio: {
    textAlign: "center", // centra el texto de vacío
    marginTop: 20, // espacio encima del texto vacío
    fontSize: 16, // tamaño del texto vacío
    color: "#888", // color gris claro para el texto vacío
  },
});