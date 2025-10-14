import { Text, View, SectionList, StyleSheet } from "react-native";

const LALIGA = [
  {
    title: 'Top 5',
    data: [
      { rank: 1, club: 'Real Madrid' },
      { rank: 2, club: 'Barcelona' },
      { rank: 3, club: 'Villarreal' },
      { rank: 4, club: 'Real Betis' },
      { rank: 5, club: 'Atlético Madrid' },
    ],
  },
  {
    title: 'Mitad de tabla',
    data: [
      { rank: 6, club: 'Sevilla' },
      { rank: 7, club: 'Elche C.F.' },
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
    title: 'Final de Tabla',
    data: [
      { rank: 18, club: 'Girona' },
      { rank: 19, club: 'Real Sociedad' },
      { rank: 20, club: 'R.C.D. Mallorca' },
    ],
  },
];

export default function Index() {
    const getBackgroundColor = (rank: number) => {
    if (rank >= 1 && rank <= 5) {
      return '#B0E57C';
    } else if (rank >= 6 && rank <= 17) {
      return '#FFB347';
    } else {
      return '#FF6F61';
    }
  };

  return (
    <View style={styles.contenedor}>
      <SectionList
      sections={LALIGA}
      keyExtractor={(item, index) => String(item.rank + index)}
      renderItem={({ item }) => (
        <View style={[styles.item, { backgroundColor: getBackgroundColor(item.rank) }]}>
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
})
