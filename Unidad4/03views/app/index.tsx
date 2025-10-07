import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>HEADER</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.left}>
          <Text style={styles.text}>LEFT</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.text}>CONTENT</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.text}>RIGHT</Text>
        </View>
      </View>
        <View style={styles.footer}>
          <Text style={styles.text}>FOOTER</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: '#24ede0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    height: '86.5%',
    justifyContent: 'space-between',
    alignItems: 'stretch', // expandirse a lo ancho
    flexDirection: 'row',
  },
  left: {
    width: '15%',
    backgroundColor: '#0a1fe2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    width: '70%',
    backgroundColor: '#5a5f56ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    width: '15%',
    backgroundColor: '#0c5e0cff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    height: 60,
    backgroundColor: '#eeb0cdff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});                        
