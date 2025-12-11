import React, { useRef } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { container } from "../../Core/container";
import { TYPES } from "../../Core/types";
import { Persona } from "../../Domain/Entities/Persona";
import { PeopleListVM } from "../viewmodels/PeopleListVM";
import { observer } from "mobx-react-lite";

const PeopleList = observer(() => {
  const vmRef = useRef<PeopleListVM | null>(null);
  if (vmRef.current === null) {
    vmRef.current = container.get<PeopleListVM>(TYPES.IndexVM);
  }
  const viewModel = vmRef.current;

  const renderItem = ({ item, index }: { item: Persona; index: number }) => {
    const isSelected = viewModel.personaSeleccionada?.id === item.id;
    const mainColor = isSelected ? "#00B140" : "#FFFFFF"; // Usamos verde Betis o blanco

    return (
      <Pressable
        onPress={() => { viewModel.personaSeleccionada = item; }}
        style={[styles.card, { borderColor: mainColor }]}
      >
        <Text style={{ color: mainColor }}>
          {`${index + 1}. ${item.nombre} ${item.apellidos}`}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={viewModel.personasList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B1B",
  },
  card: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default PeopleList;
