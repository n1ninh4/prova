import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const schema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email obrigatório'),
  senha: Yup.string().min(6, 'Mínimo 6 caracteres').required('Senha obrigatória'),
});

const LoginScreen = ({ navigation }) => {
  const handleLogin = async (values) => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('usuario');
      if (dadosSalvos) {
        const usuario = JSON.parse(dadosSalvos);

        if (
          usuario.email === values.email &&
          usuario.senha === values.senha
        ) {
          navigation.navigate('Home');
        } else {
          alert('E-mail ou senha incorretos');
        }
      } else {
        alert('Nenhum usuário cadastrado ainda. Por favor, cadastre-se.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image source={require('../images/logo.png')} style={styles.logo} />
      <Formik
        initialValues={{ email: '', senha: '' }}
        validationSchema={schema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
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
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

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
            {touched.senha && errors.senha && (
              <Text style={styles.error}>{errors.senha}</Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={!(values.email && values.senha && !errors.email && !errors.senha)}
              style={styles.button}
            >
              Entrar
            </Button>

            <Button
              onPress={() => navigation.navigate('Cadastro')}
              style={{ marginTop: 16 }}
            >
              Não tem conta? Cadastre-se
            </Button>
          </>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fffaf0',
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
