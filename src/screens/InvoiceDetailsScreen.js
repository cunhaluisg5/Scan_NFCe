import React, { useLayoutEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { api } from '../services/Api';
import { AppCard, GhostButton, PrimaryButton, Screen } from '../components/ui';
import { colors, fonts, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/format';

export function InvoiceDetailsScreen({ navigation, route }) {
  const { invoice, mode, crawlerPayload } = route.params;
  const [busy, setBusy] = useState(false);

  async function saveInvoice() {
    try {
      setBusy(true);
      await api.post('/nfces', crawlerPayload);
      Alert.alert('Nota salva', 'A NFC-e foi registrada com sucesso.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Alert.alert('Atenção', error.data?.error || error.message);
    } finally {
      setBusy(false);
    }
  }

  function confirmDelete() {
    Alert.alert('Excluir nota', 'Deseja realmente remover esta NFC-e?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: deleteInvoice,
      },
    ]);
  }

  async function deleteInvoice() {
    try {
      setBusy(true);
      await api.delete(`/nfces/${invoice._id || invoice.id}`);
      Alert.alert('Nota removida', 'A NFC-e foi excluída com sucesso.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Alert.alert('Atenção', error.data?.error || error.message);
    } finally {
      setBusy(false);
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        mode === 'draft' ? (
          <PrimaryButton
            title={busy ? 'Salvando...' : 'Salvar'}
            onPress={saveInvoice}
            disabled={busy}
            style={styles.headerButton}
          />
        ) : (
          <GhostButton title="Excluir" onPress={confirmDelete} danger style={styles.headerGhostButton} />
        )
      ),
    });
  }, [busy, mode, navigation]);

  return (
    <Screen>
      <View style={styles.content}>
        <AppCard style={styles.summaryCard}>
          <Text style={styles.storeName}>{invoice.socialName?.toUpperCase()}</Text>
          <Text style={styles.summaryText}>CNPJ: {invoice.cnpj}</Text>
          <Text style={styles.summaryText}>UF: {invoice.uf}</Text>
          <Text style={styles.summaryText}>Inscrição estadual: {invoice.stateRegistration}</Text>
          <Text style={styles.summaryText}>Data de emissão: {invoice.issuanceDate}</Text>
        </AppCard>

        <Text style={styles.sectionTitle}>Itens da nota</Text>
        <FlatList
          data={invoice.items || []}
          keyExtractor={(item, index) => item._id || item.id || `${item.itemCode}-${index}`}
          contentContainerStyle={styles.itemsList}
          renderItem={({ item }) => (
            <AppCard style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.itemName}</Text>
              <Text style={styles.itemMeta}>Código: {item.itemCode || 'N/D'}</Text>
              <Text style={styles.itemMeta}>Quantidade: {item.qtdItem}</Text>
              <Text style={styles.itemMeta}>Unidade: {item.unItem}</Text>
              <Text style={styles.itemValue}>{formatCurrency(item.itemValue)}</Text>
            </AppCard>
          )}
          ListFooterComponent={(
            <AppCard style={styles.footerCard}>
              <Text style={styles.footerText}>Base de cálculo: {formatCurrency(invoice.icmsCalculationBasis)}</Text>
              <Text style={styles.footerText}>Valor ICMS: {formatCurrency(invoice.icmsValue)}</Text>
              <Text style={styles.footerStrong}>Itens totais: {invoice.totalItems}</Text>
              <Text style={styles.footerStrong}>Valor total: {formatCurrency(invoice.totalValue)}</Text>
            </AppCard>
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: spacing.md,
  },
  summaryCard: {
    gap: 6,
  },
  storeName: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  summaryText: {
    color: colors.ink800,
    lineHeight: 21,
  },
  sectionTitle: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  itemsList: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  itemCard: {
    gap: 6,
  },
  itemTitle: {
    color: colors.ink900,
    fontSize: 17,
    fontWeight: '700',
  },
  itemMeta: {
    color: colors.slate500,
  },
  itemValue: {
    color: colors.amber600,
    fontWeight: '800',
    marginTop: 4,
  },
  footerCard: {
    gap: 8,
  },
  footerText: {
    color: colors.ink800,
  },
  footerStrong: {
    color: colors.ink900,
    fontWeight: '800',
    fontSize: 16,
  },
  headerButton: {
    minHeight: 36,
    paddingHorizontal: 16,
  },
  headerGhostButton: {
    minHeight: 36,
    paddingHorizontal: 14,
    marginRight: spacing.sm,
  },
});
