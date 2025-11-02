import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchUsers } from './src/api/userApi'; // Importa la función no asíncrona

export default function UserListScreen() {
  const { userAge } = useLocalSearchParams();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userAge) {
      // Llamar a la función async dentro de useEffect
      const loadUsers = async () => {
        try {
          const fetchedUsers = await fetchUsers(Number(userAge));
          setUsers(fetchedUsers); // Actualiza el estado con los usuarios filtrados
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false); // Cambiar el estado de carga una vez que termine la petición
        }
      };

      loadUsers(); // Ejecutar la función asincrónica
    }
  }, [userAge]);

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
