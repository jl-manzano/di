#! Crea una “Card” dentro del archivo “index.tsx”. Para ello usa un View que contenga una imagen y un texto. Asegúrate de que todo el contenido esté correctamente anidado. Ponle mediante estilos un borde redondeado por las esquinas a la tarjeta.

import { Text, View, Image, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    }} >
      <View style={styles.card}>
        <Image
          source={require('../../assets/images/iron.jpg')}
          style={styles.image}
        />
        <Text style={styles.text}>Fernando Galiana</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 350,
    height: 150,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 75,
    height: 75,
    marginBottom: 10,
    borderRadius: 50,
  },

  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

