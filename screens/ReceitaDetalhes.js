import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Linking, Alert, View } from 'react-native';
import { Card, Title, Paragraph, Button, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReceitaDetalhes({ route, navigation }) {
  const { receita } = route.params;
  const [favoritado, setFavoritado] = useState(false);

  // Carregar status de favorito ao abrir a tela
  useEffect(() => {
    verificarFavorito();
  }, []);

  async function verificarFavorito() {
    try {
      const dados = await AsyncStorage.getItem('favoritos');
      const favoritos = dados ? JSON.parse(dados) : [];
      const achou = favoritos.some(r => r.titulo === receita.titulo);
      setFavoritado(achou);
    } catch (error) {
      console.log('Erro ao verificar favoritos:', error);
    }
  }

  async function toggleFavorito() {
    try {
      const dados = await AsyncStorage.getItem('favoritos');
      let favoritos = dados ? JSON.parse(dados) : [];

      if (favoritado) {
        favoritos = favoritos.filter(r => r.titulo !== receita.titulo);
        Alert.alert('Removido', 'Receita removida dos favoritos.');
      } else {
        favoritos.push(receita);
        Alert.alert('Adicionado', 'Receita adicionada aos favoritos.');
      }

      await AsyncStorage.setItem('favoritos', JSON.stringify(favoritos));
      setFavoritado(!favoritado);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos.');
    }
  }

  // Listar ingredientes (assumindo que seja uma string separada por \n)
  const ingredientes = receita.ingredientes
    ? receita.ingredientes.split('\n').filter(i => i.trim() !== '')
    : [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.card}>
        {receita.imagem && (
          <Card.Cover source={{ uri: receita.imagem }} style={styles.capa} />
        )}
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.titulo}>{receita.titulo}</Title>
            <Button
              mode={favoritado ? 'contained' : 'outlined'}
              buttonColor="#E65100"
              textColor="#fff"
              onPress={toggleFavorito}
              style={styles.botaoFavorito}
            >
              {favoritado ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
            </Button>
          </View>

          <Divider style={styles.divider} />

          <Section title="Ingredientes">
            {ingredientes.length > 0 ? (
              ingredientes.map((item, index) => (
                <Paragraph key={index} style={styles.paragrafo}>
                  • {item.trim()}
                </Paragraph>
              ))
            ) : (
              <Paragraph style={styles.paragrafo}>Sem ingredientes listados.</Paragraph>
            )}
          </Section>

          <Divider style={styles.divider} />

          <Section title="Modo de Preparo">
            <Paragraph style={styles.paragrafo}>
              {receita.modoPreparo || 'Modo de preparo não informado.'}
            </Paragraph>
          </Section>

          {receita.tempoPreparo && (
            <>
              <Divider style={styles.divider} />
              <Section title="Tempo de Preparo">
                <Paragraph style={[styles.paragrafo, styles.tempo]}>
                  {receita.tempoPreparo}
                </Paragraph>
              </Section>
            </>
          )}

          {receita.observacoes && (
            <>
              <Divider style={styles.divider} />
              <Section title="Observações">
                <Paragraph style={styles.paragrafo}>{receita.observacoes}</Paragraph>
              </Section>
            </>
          )}

          {receita.youtube && (
            <>
              <Divider style={styles.divider} />
              <Button
                icon="youtube"
                mode="outlined"
                buttonColor="#E65100"
                textColor="#E65100"
                onPress={() => Linking.openURL(receita.youtube)}
                style={{ marginTop: 10 }}
              >
                Ver vídeo no YouTube
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Title style={styles.subtitulo}>{title}</Title>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 14,
  },
  card: {
    borderRadius: 14,
    elevation: 6,
    shadowColor: '#E65100',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  capa: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    height: 260,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 18,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#E65100',
    flex: 1,
    flexWrap: 'wrap',
  },
  botaoFavorito: {
    minWidth: 160,
  },
  divider: {
    marginVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  section: {
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 6,
  },
  paragrafo: {
    fontSize: 17,
    color: '#4E4E4E',
    lineHeight: 26,
  },
  tempo: {
    color: '#FF9800',
    fontWeight: '700',
  },
});
