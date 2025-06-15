import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_SIZE = width / 2.3;

export default function ReceitaLista({ navigation }) {
  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarReceitas);
    return unsubscribe;
  }, [navigation]);

  async function carregarReceitas() {
    const dados = await AsyncStorage.getItem('receitas');
    setReceitas(dados ? JSON.parse(dados) : []);
  }

  const excluirReceita = (index) => {
    Alert.alert(
      'Excluir Receita',
      'Tem certeza que deseja excluir esta receita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const novasReceitas = [...receitas];
            novasReceitas.splice(index, 1);
            await AsyncStorage.setItem('receitas', JSON.stringify(novasReceitas));
            setReceitas(novasReceitas);
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ReceitaDetalhes', { receita: item })}
      activeOpacity={0.8}
    >
      {item.imagem ? (
        <Image source={{ uri: item.imagem }} style={styles.imagem} />
      ) : (
        <View style={[styles.imagem, styles.imagemVazia]}>
          <FontAwesome name="cutlery" size={40} color="#ccc" />
        </View>
      )}

      <Text style={styles.titulo} numberOfLines={2}>
        {item.titulo}
      </Text>

      <View style={styles.botoes}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={(e) => {
            e.stopPropagation();
            navigation.navigate('ReceitaForm', { receita: item, index });
          }}
        >
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={(e) => {
            e.stopPropagation();
            excluirReceita(index);
          }}
        >
          <Text style={styles.textoBotao}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (receitas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.tituloTela}>Minhas Receitas</Text>
        <View style={styles.containerVazio}>
          <FontAwesome name="cutlery" size={64} color="#E65100" />
          <Text style={styles.textoVazio}>
            Você ainda não publicou nenhuma receita.{'\n'}
            Clique no botão "+" abaixo para adicionar a sua primeira receita!
          </Text>
          <TouchableOpacity
            style={styles.botaoAdd}
            onPress={() => navigation.navigate('ReceitaForm')}
            activeOpacity={0.7}
          >
            <Text style={styles.textoBotaoAdd}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tituloTela}>Minhas Receitas</Text>
      <FlatList
        data={receitas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.botaoAdd}
        onPress={() => navigation.navigate('ReceitaForm')}
        activeOpacity={0.7}
      >
        <Text style={styles.textoBotaoAdd}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 12,
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
  lista: {
    paddingBottom: 100,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 12,
    width: CARD_SIZE,
    alignItems: 'center',
    paddingVertical: 15,
    shadowColor: '#E65100',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imagem: {
    width: CARD_SIZE * 0.8,
    height: CARD_SIZE * 0.8,
    borderRadius: (CARD_SIZE * 0.8) / 2,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#E65100',
    backgroundColor: '#f9f9f9',
  },
  imagemVazia: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  titulo: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#E65100',
    textAlign: 'center',
    paddingHorizontal: 6,
    minHeight: 44,
  },
  botoes: {
    flexDirection: 'row',
    marginTop: 14,
    justifyContent: 'center',
  },
  botaoEditar: {
    backgroundColor: '#FF9800',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginHorizontal: 6,
  },
  botaoExcluir: {
    backgroundColor: '#E65100',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginHorizontal: 6,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  botaoAdd: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    backgroundColor: '#E65100',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  textoBotaoAdd: {
    color: '#fff',
    fontSize: 36,
    lineHeight: 36,
    marginBottom: 2,
  },
  containerVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  textoVazio: {
    fontSize: 18,
    color: '#E65100',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
});
