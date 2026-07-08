import React, { useEffect, useState } from 'react';
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'react-native';

import { AppInput, GhostButton, PrimaryButton, Screen, SectionHeader, SettingRow, StatusBanner } from '../components/ui';
import { HAS_HELP_CENTER_URL, HELP_CENTER_URL } from '../config/links';
import { useAuth } from '../context/AuthContext';
import { getAutoSavePreference, setAutoSavePreference } from '../storage/preferences';
import { colors, fonts, radius, spacing } from '../theme';

export function SettingsScreen() {
  const { user, updateName } = useAuth();
  const [autoSave, setAutoSave] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    (async () => {
      setAutoSave(await getAutoSavePreference());
    })();
  }, []);

  useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

  async function handleToggle(value) {
    await setAutoSavePreference(value);
    setAutoSave(value);
    setFeedback({
      tone: 'success',
      title: value ? 'Gravação automática ativada' : 'Gravação automática desativada',
      message: value
        ? 'As próximas notas poderão ser salvas logo após a leitura.'
        : 'A nota será revisada antes de ser gravada.',
    });
  }

  async function handleSaveName() {
    if (!name.trim()) {
      return;
    }

    try {
      setSaving(true);
      setFeedback({
        tone: 'info',
        title: 'Atualizando perfil',
        message: 'Estamos salvando seu novo nome.',
      });
      await updateName(name.trim());
      setEditVisible(false);
      setFeedback({
        tone: 'success',
        title: 'Perfil atualizado',
        message: 'Seu nome foi alterado com sucesso.',
      });
    } catch (error) {
      setFeedback({
        tone: 'error',
        title: 'Não foi possível atualizar',
        message: error.data?.error || error.message,
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleOpenHelp() {
    if (!HAS_HELP_CENTER_URL) {
      setFeedback({
        tone: 'info',
        title: 'Ajuda indisponível',
        message: 'A URL da central de ajuda ainda não foi configurada para este ambiente.',
      });
      return;
    }

    const supported = await Linking.canOpenURL(HELP_CENTER_URL);

    if (!supported) {
      setFeedback({
        tone: 'error',
        title: 'Não foi possível abrir a ajuda',
        message: 'Verifique a URL configurada para a central de ajuda e tente novamente.',
      });
      return;
    }

    await Linking.openURL(HELP_CENTER_URL);
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="Configurações"
        title="Personalize sua experiência"
        description="Ajuste o comportamento do app, atualize seu perfil e acesse a central de ajuda."
      />

      {feedback ? (
        <StatusBanner title={feedback.title} message={feedback.message} tone={feedback.tone} />
      ) : null}

      <View style={styles.list}>
        <SettingRow
          title="Editar nome de usuário"
          description="Atualize o nome que aparece no menu lateral."
          onPress={() => setEditVisible(true)}
        />

        <SettingRow
          title="Salvar notas automaticamente"
          description="Quando ativado, a nota lida já é gravada sem abrir a tela de revisão."
          value={autoSave}
          onValueChange={handleToggle}
        />

        <SettingRow
          title="Ajuda"
          description="Abrir a central de ajuda do aplicativo."
          onPress={handleOpenHelp}
        />

        <SettingRow
          title="Sobre"
          description="Veja informações rápidas sobre o aplicativo."
          onPress={() => setAboutVisible(true)}
        />
      </View>

      <Modal visible={editVisible} transparent animationType="fade" onRequestClose={() => setEditVisible(false)}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar nome</Text>
            <AppInput label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" />
            <View style={styles.modalActions}>
              <PrimaryButton title={saving ? 'Salvando...' : 'Salvar'} onPress={handleSaveName} disabled={!name.trim() || saving} />
              <GhostButton title="Cancelar" onPress={() => setEditVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={aboutVisible} transparent animationType="fade" onRequestClose={() => setAboutVisible(false)}>
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.modalTitle}>Sobre o Scan NFC-e</Text>
            <Text style={styles.aboutText}>Versão 2.0.0</Text>
            <Text style={styles.aboutText}>2020-2026 | Luis Gustavo da Cunha Cipriani</Text>
            <GhostButton title="Fechar" onPress={() => setAboutVisible(false)} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  list: {
    gap: spacing.md,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  modalTitle: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 26,
  },
  modalActions: {
    gap: spacing.sm,
  },
  logo: {
    width: 96,
    height: 96,
    alignSelf: 'center',
  },
  aboutText: {
    color: colors.ink800,
    textAlign: 'center',
    lineHeight: 22,
  },
});
