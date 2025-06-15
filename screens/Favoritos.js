import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

export default function Favoritos({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarFavoritos);
    return unsubscribe;
  }, [navigation]);

  async function carregarFavoritos() {
    const dadosLocais = await AsyncStorage.getItem('receitas');
    const dadosApi = await AsyncStorage.getItem('favoritosAPI');

    const locais = dadosLocais ? JSON.parse(dadosLocais).filter(r => r.favorito) : [];
    const api = dadosApi ? JSON.parse(dadosApi) : [];

    const combinados = [
      ...locais.map(r => ({ ...r, origem: 'local' })),
      ...api.map(r => ({
        id: r.idMeal,
        titulo: r.strMeal,
        imagem: r.strMealThumb,
        origem: 'api',
        receitaApi: r,
      })),
    ];

    setFavoritos(combinados);
  }

  const removerFavorito = async (item) => {
    if (item.origem === 'local') {
      const dadosLocais = await AsyncStorage.getItem('receitas');
      let locais = dadosLocais ? JSON.parse(dadosLocais) : [];
      locais = locais.map(r => {
        if (r.id === item.id) r.favorito = false;
        return r;
      });
      await AsyncStorage.setItem('receitas', JSON.stringify(locais));
    } else {
      const dadosApi = await AsyncStorage.getItem('favoritosAPI');
      let api = dadosApi ? JSON.parse(dadosApi) : [];
      api = api.filter(r => r.idMeal !== item.id);
      await AsyncStorage.setItem('favoritosAPI', JSON.stringify(api));
    }
    carregarFavoritos();
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => {
          if (item.origem === 'local') {
            navigation.navigate('ReceitaDetalhes', { receita: item });
          } else {
            navigation.navigate('ReceitaApiDetalhes', { receita: item.receitaApi });
          }
        }}
      >
        {item.imagem ? (
          <Image source={{ uri: item.imagem }} style={styles.imagem} />
        ) : (
          <View style={[styles.imagem, styles.imagemVazia]}>
            <Text style={{ color: '#999' }}>Sem Imagem</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.titulo}>{item.titulo}</Text>
          <Text style={styles.origem}>{item.origem === 'api' ? 'Recomendação da API' : 'Receita Local'}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removerFavorito(item)} style={styles.btnRemover}>
        <Text style={styles.txtRemover}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.tituloTela}>Meus Favoritos</Text>

      {favoritos.length === 0 ? (
        <View style={styles.semFavoritosContainer}>
          <FontAwesome name="heart" size={64} color="#E65100" />
          <Text style={styles.textoSemFavoritos}>
            Você ainda não adicionou favoritos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 60,
  },
  tituloTela: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 30,
    alignSelf: 'center',
    fontFamily: 'sans-serif-condensed',
    letterSpacing: 1,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#E65100',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imagem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  imagemVazia: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flexShrink: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
  },
  origem: {
    fontSize: 14,
    color: '#FF9800',
    marginTop: 4,
  },
  btnRemover: {
    backgroundColor: '#E65100',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  txtRemover: {
    color: '#fff',
    fontWeight: 'bold',
  },
  semFavoritosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textoSemFavoritos: {
    fontSize: 18,
    color: '#E65100',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});
