// app/index.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View>
      <Text>Bienvenido a la aplicación!</Text>
      <Link href={{ pathname: '/userList', params: { userAge: '30' } }}>
        <Button title="Ver lista de usuarios" />
      </Link>
    </View>
  );
}
