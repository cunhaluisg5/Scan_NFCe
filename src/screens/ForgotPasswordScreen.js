import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { AppCard, AppInput, GhostButton, PrimaryButton, Screen, StatusBanner } from '../components/ui';
import { api } from '../services/Api';
import { colors, fonts, spacing } from '../theme';

export function ForgotPasswordScreen({ navigation, route }) {
  const [email, setEmail] = useState(route.params?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const valid = useMemo(() => email.includes('@'), [email]);

  async function handleSubmit() {
    if (!valid || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setFeedback({
        tone: 'info',
        title: 'Enviando e-mail',
        message: 'Estamos preparando as instruções de recuperação.',
      });
      await api.post('/auth/forgot_password', { email: email.trim() }, { auth: false });
      setFeedback({
        tone: 'success',
        title: 'E-mail enviado',
        message: 'As instruções de recuperação foram enviadas para o endereço informado.',
      });
    } catch (error) {
      setFeedback({
        tone: 'error',
        title: 'Não foi possível enviar',
        message: error.data?.error || error.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
      <AppCard style={styles.card}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.description}>
          Informe o e-mail cadastrado para receber as instruções de redefinição.
        </Text>

        {feedback ? (
          <StatusBanner title={feedback.title} message={feedback.message} tone={feedback.tone} />
        ) : null}

        <AppInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.actions}>
          <PrimaryButton
            title={submitting ? 'Enviando...' : 'Enviar'}
            onPress={handleSubmit}
            disabled={!valid || submitting}
          />
          <GhostButton title="Voltar ao login" onPress={() => navigation.goBack()} />
        </View>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },
  logo: {
    width: 88,
    height: 88,
    alignSelf: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: colors.ink900,
    textAlign: 'center',
  },
  description: {
    color: colors.slate500,
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.sm,
  },
});
