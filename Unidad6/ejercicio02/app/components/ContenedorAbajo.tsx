import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
    children: React.ReactNode;
};


export function ContenedorAbajo({ children }: Props) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        width: '100%',
    }
});