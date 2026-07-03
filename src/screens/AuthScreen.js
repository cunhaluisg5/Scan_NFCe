import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../context/AuthContext';
import { AppCard, AppInput, PrimaryButton, Screen } from '../components/ui';
import { colors, fonts, radius, shadow, spacing } from '../theme';

export function AuthScreen({ navigation }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validForm = useMemo(() => {
    const emailValid = email.includes('@');
    const passwordValid = password.length >= 6;

    if (mode === 'signup') {
      return Boolean(name.trim() && emailValid && passwordValid && password === confirmPassword);
    }

    return Boolean(emailValid && passwordValid);
  }, [confirmPassword, email, mode, name, password]);

  async function handleSubmit() {
    if (!validForm || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      if (mode === 'signup') {
        await signUp({ name: name.trim(), email: email.trim(), password });
        Alert.alert('Conta criada', 'Cadastro efetuado com sucesso. Agora faça seu login.');
        setMode('signin');
        setPassword('');
        setConfirmPassword('');
      } else {
        await signIn(email.trim(), password);
      }
    } catch (error) {
      Alert.alert('Atenção', error.data?.error || error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ gap: spacing.lg }}>
        <LinearGradient
          colors={[colors.ink900, colors.ink700, colors.teal700]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.heroEyebrow}>Scan NFC-e</Text>
          <Text style={styles.heroTitle}>
            {mode === 'signup' ? 'Crie sua conta e organize suas notas.' : 'Leia, salve e analise suas compras.'}
          </Text>
        </LinearGradient>

        <AppCard style={styles.formCard}>
          <Text style={styles.formTitle}>{mode === 'signup' ? 'Nova conta' : 'Entrar'}</Text>
          <View style={styles.formFields}>
            {mode === 'signup' ? (
              <AppInput label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" autoCapitalize="words" />
            ) : null}

            <AppInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="voce@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <AppInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo de 6 caracteres"
              secureTextEntry
            />

            {mode === 'signup' ? (
              <AppInput
                label="Confirmar senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repita a senha"
                secureTextEntry
              />
            ) : null}
          </View>

          <PrimaryButton
            title={submitting ? 'Processando...' : mode === 'signup' ? 'Registrar' : 'Entrar'}
            onPress={handleSubmit}
            disabled={!validForm || submitting}
          />

          <View style={styles.links}>
            <Pressable onPress={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
              <Text style={styles.linkText}>
                {mode === 'signup' ? 'Já possui conta? Fazer login' : 'Criar uma conta'}
              </Text>
            </Pressable>

            {mode === 'signin' ? (
              <Pressable onPress={() => navigation.navigate('ForgotPasswordScreen', { email })}>
                <Text style={[styles.linkText, styles.linkAccent]}>Esqueceu sua senha?</Text>
              </Pressable>
            ) : null}
          </View>
        </AppCard>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadow,
  },
  logo: {
    width: 96,
    height: 96,
  },
  heroEyebrow: {
    color: '#C7F9F2',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 12,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 28,
    lineHeight: 36,
  },
  formCard: {
    gap: spacing.lg,
  },
  formTitle: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 26,
  },
  formFields: {
    gap: spacing.md,
  },
  links: {
    gap: spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: colors.ink800,
    fontSize: 15,
    fontWeight: '600',
  },
  linkAccent: {
    color: colors.teal700,
  },
});
