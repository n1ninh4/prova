import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ReceitaForm({ navigation, route }) {
  const receitaEdit = route.params?.receita;
  const receitaIndex = route.params?.index;

  const [titulo, setTitulo] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [modoPreparo, setModoPreparo] = useState('');
  const [tempoPreparo, setTempoPreparo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    if (receitaEdit) {
      setTitulo(receitaEdit.titulo);
      setIngredientes(receitaEdit.ingredientes);
      setModoPreparo(receitaEdit.modoPreparo);
      setTempoPreparo(receitaEdit.tempoPreparo);
      setObservacoes(receitaEdit.observacoes);
      setImagem(receitaEdit.imagem);
    }
  }, [receitaEdit]);

  const selecionarImagem = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.cancelled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const salvarReceita = async () => {
    if (!titulo || !ingredientes || !modoPreparo || !tempoPreparo) {
      Alert.alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const novaReceita = {
      titulo,
      ingredientes,
      modoPreparo,
      tempoPreparo,
      observacoes,
      imagem,
    };

    const receitasSalvas = JSON.parse(await AsyncStorage.getItem('receitas')) || [];

    if (typeof receitaIndex === 'number') {
      receitasSalvas[receitaIndex] = novaReceita;
    } else {
      receitasSalvas.push(novaReceita);
    }

    await AsyncStorage.setItem('receitas', JSON.stringify(receitasSalvas));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Foto da Receita:</Text>
        <Card style={styles.cardImagem} onTouchEnd={selecionarImagem}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.preview} />
          ) : (
            <View style={styles.iconeVazio}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={80} color="#FF9800" />
              <Text style={styles.textoIconeVazio}>Toque para selecionar uma imagem</Text>
            </View>
          )}
        </Card>

        <Text style={styles.label}>Título:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o título da receita"
          value={titulo}
          onChangeText={setTitulo}
          placeholderTextColor="#aaa"
          returnKeyType="next"
        />

        <Text style={styles.label}>Ingredientes:</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Liste os ingredientes, um por linha"
          value={ingredientes}
          onChangeText={setIngredientes}
          multiline
          placeholderTextColor="#aaa"
          textAlignVertical="top"
        />

        <Text style={styles.label}>Modo de Preparo:</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Descreva o modo de preparo"
          value={modoPreparo}
          onChangeText={setModoPreparo}
          multiline
          placeholderTextColor="#aaa"
          textAlignVertical="top"
        />

        <Text style={styles.label}>Tempo de Preparo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 30 minutos"
          value={tempoPreparo}
          onChangeText={setTempoPreparo}
          placeholderTextColor="#aaa"
          returnKeyType="done"
        />

        <Text style={styles.label}>Outras Observações (opcional):</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Digite outras informações"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          placeholderTextColor="#aaa"
          textAlignVertical="top"
        />

        <Button
          mode="contained"
          onPress={salvarReceita}
          style={styles.botaoSalvar}
          labelStyle={{ fontWeight: 'bold', fontSize: 18 }}
          buttonColor="#E65100"
          rippleColor="#FF9800"
        >
          Salvar Receita
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FF6F00',
    textAlign: 'center',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E65100',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 18,
    color: '#333',
  },
  multiline: {
    height: 100,
  },
  cardImagem: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
  preview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  iconeVazio: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
  },
  textoIconeVazio: {
    marginTop: 10,
    fontSize: 16,
    color: '#E65100',
    fontWeight: '600',
  },
  botaoSalvar: {
    marginTop: 30,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
