import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Linking, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReceitaApiDetalhes = ({ route, navigation }) => {
  const { receita } = route.params;
  const [favoritado, setFavoritado] = useState(false);

  // Carregar status de favorito ao abrir tela
  useEffect(() => {
    verificarFavorito();
  }, []);

  async function verificarFavorito() {
    const dadosApi = await AsyncStorage.getItem('favoritosAPI');
    const favoritos = dadosApi ? JSON.parse(dadosApi) : [];
    const achou = favoritos.some(r => r.idMeal === receita.idMeal);
    setFavoritado(achou);
  }

  async function toggleFavorito() {
    const dadosApi = await AsyncStorage.getItem('favoritosAPI');
    let favoritos = dadosApi ? JSON.parse(dadosApi) : [];

    if (favoritado) {
      // Remove dos favoritos
      favoritos = favoritos.filter(r => r.idMeal !== receita.idMeal);
      Alert.alert('Removido', 'Receita removida dos favoritos.');
    } else {
      // Adiciona aos favoritos
      favoritos.push(receita);
      Alert.alert('Adicionado', 'Receita adicionada aos favoritos.');
    }

    await AsyncStorage.setItem('favoritosAPI', JSON.stringify(favoritos));
    setFavoritado(!favoritado);
  }

  const ingredientes = [];
  for (let i = 1; i <= 20; i++) {
    const ingrediente = receita[`strIngredient${i}`];
    const medida = receita[`strMeasure${i}`];
    if (ingrediente && ingrediente.trim() !== '') {
      ingredientes.push(`• ${ingrediente} - ${medida}`);
    }
  }

  return (
    <ScrollView style={{ padding: 10 }}>
      <Card>
        <Card.Cover source={{ uri: receita.strMealThumb }} />
        <Card.Content>
          <Title>{receita.strMeal}</Title>
          <Paragraph>Categoria: {receita.strCategory}</Paragraph>
          <Paragraph>Origem: {receita.strArea}</Paragraph>

          <Button
            mode={favoritado ? 'contained' : 'outlined'}
            onPress={toggleFavorito}
            style={{ marginVertical: 10 }}
            buttonColor="#E65100"
            textColor="#fff"
          >
            {favoritado ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </Button>

          <Title style={styles.subtitulo}>Ingredientes</Title>
          {ingredientes.map((item, index) => (
            <Paragraph key={index}>{item}</Paragraph>
          ))}

          <Title style={styles.subtitulo}>Modo de Preparo</Title>
          <Paragraph>{receita.strInstructions}</Paragraph>

          {receita.strYoutube ? (
            <Button onPress={() => Linking.openURL(receita.strYoutube)} style={{ marginTop: 10 }}>
              Ver vídeo no YouTube
            </Button>
          ) : null}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  subtitulo: {
    marginTop: 15,
    fontWeight: 'bold',
  },
});

export default ReceitaApiDetalhes;
