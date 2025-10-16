import React from "react";
import { Text, View, SectionList, StyleSheet, Image } from "react-native";

const LALIGA = [
  {
    title: 'PRINCIPIO DE TABLA',
    data: [
      { rank: 1, club: 'Real Madrid' },
      { rank: 2, club: 'Barcelona' },
      { rank: 3, club: 'Villarreal' },
      { rank: 4, club: 'Real Betis' },
      { rank: 5, club: 'Atlético Madrid' },
      { rank: 6, club: 'Sevilla' },
      { rank: 7, club: 'Elche C.F.' },
    ],
  },
  {
    title: 'MITAD DE TABLA',
    data: [
      { rank: 8, club: 'Athletic' },
      { rank: 9, club: 'RCD Espanyol' },
      { rank: 10, club: 'Alavés' },
      { rank: 11, club: 'Getafe' },
      { rank: 12, club: 'Osasuna' },
      { rank: 13, club: 'Levante' },
      { rank: 14, club: 'Rayo Vallecano' },
      { rank: 15, club: 'Valencia C.F.' },
      { rank: 16, club: 'Celta de Vigo' },
      { rank: 17, club: 'Real Oviedo' },
    ],
  },
  {
    title: 'FINAL DE TABLA',
    data: [
      { rank: 18, club: 'Girona' },
      { rank: 19, club: 'Real Sociedad' },
      { rank: 20, club: 'R.C.D. Mallorca' },
    ],
  },
];

const obtenerIcono = (posicion: number) => {
  if (posicion >= 1 && posicion <= 4) {
    return <Image source={require('../assets/images/champions-icon.png')} style={styles.icono} />;
  } else if (posicion >= 5 && posicion <= 6) {
    return <Image source={require('../assets/images/europa-icon.png')} style={styles.icono} />;
  } else if (posicion == 7) {
    return <Image source={require('../assets/images/conference-icon.png')} style={styles.icono} />;
  } else if (posicion >= 18) {
    return <Image source={require('../assets/images/hypermotion-icon.jpg')} style={styles.icono} />;
  }
};

const getBackgroundColor = (rank: number) => {
  if (rank >= 1 && rank <= 7) {
    return '#B0E57C';
  } else if (rank >= 8 && rank <= 17) {
    return '#FFB347';
  } else {
    return '#FF6F61';
  }
};

export default function Index() {
  return (
    <View style={styles.contenedor}>
      <SectionList
        sections={LALIGA}
        keyExtractor={(item, index) => String(item.rank + index)}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: getBackgroundColor(item.rank) }]}>
            {obtenerIcono(item.rank)}
            <Text style={styles.rank}>{item.rank}</Text>
            <Text style={styles.club}>{item.club}</Text>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.header}>{section.title}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    backgroundColor: '#f1f1f1',
    paddingLeft: 10,
    paddingBottom: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rank: {
    width: 30,
    fontWeight: 'bold',
    fontSize: 16,
  },
  club: {
    fontSize: 16,
    marginLeft: 10,
  },
  icono: {
    width: 27,
    height: 27,
    marginRight: 15,
    borderRadius: 20,
  },
});
