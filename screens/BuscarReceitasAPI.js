import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, StyleSheet, KeyboardAvoidingView,
  Platform, Text
} from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BuscarReceitasAPI = ({ navigation }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [receitasApi, setReceitasApi] = useState([]);
  const [receitasLocais, setReceitasLocais] = useState([]);

  const removerAcentos = (str) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C');

  const buscarTodasReceitas = async (termoOriginal = termoBusca) => {
    const termo = removerAcentos(termoOriginal.toLowerCase());

    // Buscar receitas locais
    try {
      const dados = await AsyncStorage.getItem('receitas');
      const salvas = dados ? JSON.parse(dados) : [];

      const locaisFiltradas = salvas.filter(r => {
        const titulo = removerAcentos(r.titulo.toLowerCase());
        return titulo.includes(termo);
      });

      setReceitasLocais(locaisFiltradas);
    } catch (error) {
      console.error('Erro ao buscar receitas locais', error);
    }

    // Buscar receitas da API
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${termoOriginal}`
      );
      setReceitasApi(response.data.meals || []);
    } catch (error) {
      console.error('Erro ao buscar receitas da API', error);
    }
  };

  useEffect(() => {
    buscarTodasReceitas('');
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Encontre Receitas</Text>

        <TextInput
          label="Buscar Receita"
          value={termoBusca}
          onChangeText={setTermoBusca}
          mode="outlined"
          style={styles.input}
          placeholder="Ex: arroz, frango, bolo..."
          theme={{ colors: { primary: '#E65100' } }}
        />

        <Button
          mode="contained"
          onPress={() => buscarTodasReceitas()}
          style={styles.botao}
          buttonColor="#FF9800"
          textColor="white"
        >
          Buscar
        </Button>

        {receitasLocais.length > 0 && (
          <Text style={styles.subtitulo}>🍽️ Receitas Cadastradas por Você</Text>
        )}

        {receitasLocais.map((r, index) => (
          <Card
            key={`local-${index}`}
            style={styles.card}
            onPress={() => navigation.navigate('ReceitaDetalhes', { receita: r })}
          >
            {r.imagem && <Card.Cover source={{ uri: r.imagem }} />}
            <Card.Content>
              <Title>{r.titulo}</Title>
              <Paragraph style={{ color: '#666' }}>Receita criada por você</Paragraph>
            </Card.Content>
          </Card>
        ))}

        {receitasApi.length > 0 && (
          <Text style={styles.subtitulo}>🌟 Recomendações da Comunidade</Text>
        )}

        {receitasApi.map((r, index) => (
          <Card
            key={`api-${index}`}
            style={styles.card}
            onPress={() => navigation.navigate('ReceitaApiDetalhes', { receita: r })}
          >
            <Card.Cover source={{ uri: r.strMealThumb }} />
            <Card.Content>
              <Title>{r.strMeal}</Title>
              <Paragraph>{r.strCategory} – {r.strArea}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  input: {
    marginBottom: 10,
    fontSize: 16,
  },
  botao: {
    marginBottom: 20,
    borderRadius: 8,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginTop: 30,
    marginBottom: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
});

export default BuscarReceitasAPI;
