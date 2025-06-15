import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const schema = Yup.object().shape({
  nome: Yup.string().min(3, 'Nome muito curto').required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email obrigatório'),
  telefone: Yup.string().min(10, 'Telefone incompleto').required('Telefone obrigatório'),
  senha: Yup.string().min(6, 'Mínimo 6 caracteres').required('Senha obrigatória'),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref('senha')], 'As senhas não coincidem')
    .required('Confirme a senha'),
});

const CadastroScreen = ({ navigation }) => {
  const handleCadastro = async (values) => {
    try {
      await AsyncStorage.setItem('usuario', JSON.stringify(values));
      alert('Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao salvar cadastro:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={require('../images/logo.png')} style={styles.logo} />
        <Formik
          initialValues={{
            nome: '',
            email: '',
            telefone: '',
            senha: '',
            confirmarSenha: '',
          }}
          validationSchema={schema}
          onSubmit={handleCadastro}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <TextInput
                label="Nome completo"
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
                value={values.nome}
                onChangeText={handleChange('nome')}
                onBlur={handleBlur('nome')}
                style={styles.input}
              />
              {touched.nome && errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

              <TextInput
                label="Email"
                mode="outlined"
                left={<TextInput.Icon icon="email" />}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                style={styles.input}
              />
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <TextInput
                label="Telefone"
                mode="outlined"
                left={<TextInput.Icon icon="phone" />}
                value={values.telefone}
                onChangeText={handleChange('telefone')}
                onBlur={handleBlur('telefone')}
                keyboardType="phone-pad"
                style={styles.input}
              />
              {touched.telefone && errors.telefone && <Text style={styles.error}>{errors.telefone}</Text>}

              <TextInput
                label="Senha"
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon="lock" />}
                value={values.senha}
                onChangeText={handleChange('senha')}
                onBlur={handleBlur('senha')}
                style={styles.input}
              />
              {touched.senha && errors.senha && <Text style={styles.error}>{errors.senha}</Text>}

              <TextInput
                label="Confirmar senha"
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon="lock-check" />}
                value={values.confirmarSenha}
                onChangeText={handleChange('confirmarSenha')}
                onBlur={handleBlur('confirmarSenha')}
                style={styles.input}
              />
              {touched.confirmarSenha && errors.confirmarSenha && (
                <Text style={styles.error}>{errors.confirmarSenha}</Text>
              )}

              <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                Cadastrar
              </Button>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CadastroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf0',
  },
  scroll: {
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});
