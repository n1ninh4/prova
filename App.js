import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Telas principais
import ReceitaLista from './screens/ReceitaLista';
import ReceitaDetalhes from './screens/ReceitaDetalhes';
import ReceitaForm from './screens/ReceitaForm';
import BuscarReceitasAPI from './screens/BuscarReceitasAPI';
import ReceitaApiDetalhes from './screens/ReceitaApiDetalhes';
import PerfilScreen from './screens/PerfilScreen';
import Favoritos from './screens/Favoritos';

// Telas de acesso
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Receitas"
      barStyle={{ backgroundColor: '#000' }}
      activeColor="#FF9800"
      inactiveColor="#aaa"
      labeled={true}
      shifting={false}
    >
      <Tab.Screen
        name="Receitas"
        component={ReceitaLista}
        options={{
          tabBarLabel: 'Minhas Receitas',
          tabBarIcon: ({ color }) => <Icon name="silverware-fork-knife" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Buscar API"
        component={BuscarReceitasAPI}
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color }) => <Icon name="magnify" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={Favoritos}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color }) => <Icon name="heart" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Icon name="account" color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Cadastro' }} />
          <Stack.Screen name="Home" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="ReceitaDetalhes" component={ReceitaDetalhes} options={{ title: 'Detalhes da Receita' }} />
          <Stack.Screen name="ReceitaForm" component={ReceitaForm} options={{ title: 'Nova Receita' }} />
          <Stack.Screen name="ReceitaApiDetalhes" component={ReceitaApiDetalhes} options={{ title: 'Detalhes da Receita (API)' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
