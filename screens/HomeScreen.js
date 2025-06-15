import React from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Title>Bem-vindo ao App de Receitas!</Title>

      <Button mode="contained" style={{ margin: 10 }} onPress={() => navigation.navigate('ReceitaLista')}>
        Minhas Receitas
      </Button>

      <Button mode="contained" style={{ margin: 10 }} onPress={() => navigation.navigate('Buscar API')}>
        Buscar na API
      </Button>
    </View>
  );
};

export default HomeScreen;
