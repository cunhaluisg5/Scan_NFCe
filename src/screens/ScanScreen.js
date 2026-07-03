import React, { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';

import { LoadingBlock, PrimaryButton, Screen } from '../components/ui';
import { api } from '../services/Api';
import { getAutoSavePreference } from '../storage/preferences';
import { colors, fonts, radius, spacing } from '../theme';
import { isValidNfceUrl, mapCrawlerPayloadToInvoice, normalizeNfceUrl } from '../utils/nfce';

export function ScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [active, setActive] = useState(true);

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
      Alert.alert('QR Code inválido', 'A leitura não corresponde a uma NFC-e válida de Minas Gerais.');
      return;
    }

    try {
      setScanned(true);
      setProcessing(true);
      Vibration.vibrate(120);

      const crawlerPayload = await api.post('/crawler', { url: normalizedUrl });
      const invoice = mapCrawlerPayloadToInvoice(crawlerPayload);
      const autoSave = await getAutoSavePreference();

      if (autoSave) {
        await api.post('/nfces', crawlerPayload);
        Alert.alert('Nota salva', 'A NFC-e foi registrada automaticamente.');
        navigation.navigate('Home');
      } else {
        navigation.navigate('InvoiceDetails', {
          invoice,
          mode: 'draft',
          crawlerPayload,
        });
      }
    } catch (error) {
      Alert.alert('Atenção', error.data?.error || error.message);
      setScanned(false);
    } finally {
      setProcessing(false);
    }
  }

  if (!permission) {
    return <LoadingBlock message="Verificando acesso à câmera..." />;
  }

  if (!permission.granted) {
    return (
      <Screen contentContainerStyle={styles.permissionWrap}>
        <Text style={styles.permissionTitle}>Precisamos da câmera para ler o QR Code</Text>
        <Text style={styles.permissionText}>
          Autorize o acesso e volte para capturar as informações da NFC-e diretamente da nota.
        </Text>
        <PrimaryButton title="Permitir câmera" onPress={requestPermission} />
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
          <Text style={styles.bottomText}>
            {processing ? 'Consultando a nota...' : 'Centralize o código dentro da moldura.'}
          </Text>
          {scanned && !processing ? (
            <Pressable style={styles.retryButton} onPress={() => setScanned(false)}>
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
