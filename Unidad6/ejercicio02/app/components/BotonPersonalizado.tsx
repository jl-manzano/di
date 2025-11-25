import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

type Props = {
    label: string;
    onPress?: () => void;
    color?: string;
};


export function BotonPersonalizado({ label, onPress, color = '#FFA500' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? '#FFA500' : color },
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}


const styles = StyleSheet.create({
    button:{
        padding: 10, 
        borderRadius: 25, //Bordes
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold'
    }
});