import { createStackNavigator } from '@react-navigation/stack';
import UserListScreen from './userList'; // Importar la pantalla de lista de usuarios

const Stack = createStackNavigator();

export default function RootLayout() {
  const userAge = 30;

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UserList" 
        component={UserListScreen} 
        initialParams={{ userAge }}
      />
    </Stack.Navigator>
  );
}
