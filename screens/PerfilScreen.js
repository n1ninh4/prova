import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Avatar, Title, Paragraph, Button, Surface, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PerfilScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState({
    nome: 'Usuário Exemplo',
    email: 'usuario@email.com',
    foto: 'https://via.placeholder.com/150',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [nomeEdit, setNomeEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [fotoEdit, setFotoEdit] = useState('');

  // Carregar dados do AsyncStorage ao montar
  useEffect(() => {
    async function carregarUsuario() {
      const dados = await AsyncStorage.getItem('usuario');
      if (dados) {
        setUsuario(JSON.parse(dados));
      }
    }
    carregarUsuario();
  }, []);

  // Abrir modal preenchendo os campos atuais
  const abrirEdicao = () => {
    setNomeEdit(usuario.nome);
    setEmailEdit(usuario.email);
    setFotoEdit(usuario.foto);
    setModalVisible(true);
  };

  // Salvar edição
  const salvarEdicao = async () => {
    if (!nomeEdit.trim() || !emailEdit.trim()) {
      Alert.alert('Erro', 'Nome e email são obrigatórios.');
      return;
    }

    const novoUsuario = {
      nome: nomeEdit.trim(),
      email: emailEdit.trim(),
      foto: fotoEdit.trim() || 'https://via.placeholder.com/150',
    };

    setUsuario(novoUsuario);
    await AsyncStorage.setItem('usuario', JSON.stringify(novoUsuario));
    setModalVisible(false);
  };

  // Sair: limpar dados e ir para login
  const sair = async () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('usuario');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.card}>
        <Avatar.Image
          size={120}
          source={{ uri: usuario.foto }}
          style={styles.avatar}
        />
        <Title style={styles.title}>{usuario.nome}</Title>
        <Paragraph style={styles.info}>Email: {usuario.email}</Paragraph>

        <Button
          mode="contained"
          onPress={abrirEdicao}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
        >
          Editar Perfil
        </Button>

        <Button
          mode="outlined"
          onPress={sair}
          style={[styles.button, styles.buttonSair]}
          contentStyle={{ paddingVertical: 8 }}
          color="#E65100"
        >
          Sair
        </Button>
      </Surface>

      {/* Modal edição */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Editar Perfil</Text>

            <TextInput
              placeholder="Nome"
              value={nomeEdit}
              onChangeText={setNomeEdit}
              style={styles.input}
              autoCapitalize="words"
            />

            <TextInput
              placeholder="Email"
              value={emailEdit}
              onChangeText={setEmailEdit}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              placeholder="URL da Foto"
              value={fotoEdit}
              onChangeText={setFotoEdit}
              style={styles.input}
              autoCapitalize="none"
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalBtn, styles.btnCancelar]}
              >
                <Text style={{ color: '#E65100', fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={salvarEdicao}
                style={[styles.modalBtn, styles.btnSalvar]}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#E65100',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  avatar: {
    marginBottom: 20,
    backgroundColor: '#E65100',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#6d4c41',
    marginBottom: 4,
  },
  button: {
    marginTop: 20,
    width: '60%',
    backgroundColor: '#E65100',
  },
  buttonSair: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E65100',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 20,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E65100',
    fontSize: 16,
    marginBottom: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  btnCancelar: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E65100',
  },
  btnSalvar: {
    backgroundColor: '#E65100',
  },
});

export default PerfilScreen;
