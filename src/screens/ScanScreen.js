import React, { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';

import { PrimaryButton, Screen, StatusBanner } from '../components/ui';
import { ROUTES } from '../navigation/routeNames';
import { api } from '../services/Api';
import { getAutoSavePreference } from '../storage/preferences';
import { colors, fonts, radius, spacing } from '../theme';
import { isValidNfceUrl, mapCrawlerPayloadToInvoice, normalizeNfceUrl } from '../utils/nfce';

export function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [active, setActive] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setActive(true);
      return () => setActive(false);
    }, [])
  );

  async function handleBarcodeScanned({ data }) {
    if (scanned || processing) {
      return;
    }

    const normalizedUrl = normalizeNfceUrl(data);

    if (!isValidNfceUrl(normalizedUrl)) {
      setFeedback({
        tone: 'error',
        title: 'QR Code invalido',
        message: 'A leitura nao corresponde a uma NFC-e valida de Minas Gerais.',
      });
      return;
    }

    try {
      setScanned(true);
      setProcessing(true);
      setFeedback({
        tone: 'info',
        title: 'Consultando nota',
        message: 'Estamos buscando os dados da NFC-e no portal fiscal.',
      });
      Vibration.vibrate(120);

      const crawlerPayload = await api.post('/crawler', { url: normalizedUrl });
      const invoice = mapCrawlerPayloadToInvoice(crawlerPayload);
      const autoSave = await getAutoSavePreference();

      if (autoSave) {
        setFeedback({
          tone: 'info',
          title: 'Salvando nota',
          message: 'A gravacao automatica esta ativada. Finalizando registro.',
        });
        await api.post('/nfces', crawlerPayload);
        setFeedback({
          tone: 'success',
          title: 'Nota salva',
          message: 'A NFC-e foi registrada automaticamente.',
        });
        navigation.navigate(ROUTES.APP.HOME);
      } else {
        navigation.navigate(ROUTES.APP.INVOICE_DETAILS, {
          invoice,
          mode: 'draft',
          crawlerPayload,
        });
      }
    } catch (error) {
      setFeedback({
        tone: 'error',
        title: 'Nao foi possivel ler a nota',
        message: error.data?.error || error.message,
      });
      setScanned(false);
    } finally {
      setProcessing(false);
    }
  }

  if (!permission) {
    return (
      <Screen contentContainerStyle={styles.permissionWrap}>
        <StatusBanner title="Preparando camera" message="Verificando acesso a camera do dispositivo." tone="info" />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen contentContainerStyle={styles.permissionWrap}>
        <Text style={styles.permissionTitle}>Precisamos da camera para ler o QR Code</Text>
        <Text style={styles.permissionText}>
          Autorize o acesso e volte para capturar as informacoes da NFC-e diretamente da nota.
        </Text>
        <PrimaryButton title="Permitir camera" onPress={requestPermission} />
      </Screen>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {active ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      ) : null}

      <View style={styles.overlay}>
        <View style={styles.topBanner}>
          <Text style={styles.bannerText}>
            Aponte o leitor para o QR Code da NFC-e.
          </Text>
        </View>

        <View style={styles.focusRow}>
          <View style={styles.mask} />
          <View style={styles.focusBox} />
          <View style={styles.mask} />
        </View>

        <View style={styles.bottomArea}>
          {feedback ? (
            <StatusBanner title={feedback.title} message={feedback.message} tone={feedback.tone} />
          ) : null}
          <Text style={styles.bottomText}>
            {processing ? 'Consultando a nota...' : 'Centralize o codigo dentro da moldura.'}
          </Text>
          {scanned && !processing ? (
            <Pressable
              style={styles.retryButton}
              onPress={() => {
                setFeedback(null);
                setScanned(false);
              }}
            >
              <Text style={styles.retryText}>Ler novamente</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionWrap: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  permissionTitle: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 28,
  },
  permissionText: {
    color: colors.ink800,
    lineHeight: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
  },
  topBanner: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  bannerText: {
    color: colors.white,
    textAlign: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    padding: spacing.md,
    borderRadius: radius.pill,
    overflow: 'hidden',
    fontWeight: '700',
  },
  focusRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mask: {
    flex: 1,
  },
  focusBox: {
    width: 260,
    height: 260,
    borderWidth: 3,
    borderColor: '#F9FAFB',
    borderRadius: radius.lg,
    backgroundColor: 'transparent',
  },
  bottomArea: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  bottomText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 15,
  },
  retryButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  retryText: {
    color: colors.ink900,
    fontWeight: '700',
  },
});
