import { View, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function RegisterCard({ children }: Props) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    marginTop: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});
