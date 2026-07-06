import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppCard, GhostButton, MetricCard, PrimaryButton, Screen, SectionHeader, StatusBanner } from '../components/ui';
import { ROUTES } from '../navigation/routeNames';
import { api } from '../services/Api';
import { colors, spacing } from '../theme';
import { formatCurrency } from '../utils/format';

export function InvoiceDetailsScreen({ navigation, route }) {
  const { invoice, mode, crawlerPayload } = route.params;
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const metrics = useMemo(() => ([
    { label: 'Itens totais', value: String(invoice.totalItems || invoice.items?.length || 0) },
    { label: 'Total da compra', value: formatCurrency(invoice.totalValue), tone: 'amber' },
  ]), [invoice.items?.length, invoice.totalItems, invoice.totalValue]);

  const items = useMemo(() => invoice.items || [], [invoice.items]);

  async function saveInvoice() {
    try {
      setBusy(true);
      setFeedback({
        tone: 'info',
        title: 'Salvando nota',
        message: 'Estamos registrando a NFC-e em sua conta.',
      });
      await api.post('/nfces', crawlerPayload);
      setFeedback({
        tone: 'success',
        title: 'Nota salva',
        message: 'A NFC-e foi registrada com sucesso.',
      });
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.APP.ROOT }],
      });
    } catch (error) {
      setFeedback({
        tone: 'error',
        title: 'Nao foi possivel salvar',
        message: error.data?.error || error.message,
      });
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
      setFeedback({
        tone: 'info',
        title: 'Excluindo nota',
        message: 'Estamos removendo a NFC-e da sua conta.',
      });
      await api.delete(`/nfces/${invoice._id || invoice.id}`);
      setFeedback({
        tone: 'success',
        title: 'Nota removida',
        message: 'A NFC-e foi excluida com sucesso.',
      });
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.APP.ROOT }],
      });
    } catch (error) {
      setFeedback({
        tone: 'error',
        title: 'Nao foi possivel excluir',
        message: error.data?.error || error.message,
      });
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
          <GhostButton
            title={busy ? 'Excluindo...' : 'Excluir'}
            onPress={confirmDelete}
            danger
            style={styles.headerGhostButton}
          />
        )
      ),
    });
  }, [busy, mode, navigation]);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="Detalhes da compra"
        title={invoice.socialName?.toUpperCase()}
        description="Veja os dados principais da NFC-e, confira cada item lido e valide os totais fiscais."
      />

      {feedback ? (
        <StatusBanner title={feedback.title} message={feedback.message} tone={feedback.tone} />
      ) : null}

      <View style={styles.metrics}>
        {metrics.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} tone={item.tone} style={styles.metricCard} />
        ))}
      </View>

      <AppCard style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Resumo fiscal</Text>
        <Text style={styles.summaryText}>CNPJ: {invoice.cnpj}</Text>
        <Text style={styles.summaryText}>UF: {invoice.uf}</Text>
        <Text style={styles.summaryText}>Inscricao estadual: {invoice.stateRegistration}</Text>
        <Text style={styles.summaryText}>Data de emissao: {invoice.issuanceDate}</Text>
      </AppCard>

      <Text style={styles.sectionTitle}>Itens da nota</Text>

      {items.length ? (
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <AppCard key={item._id || item.id || `${item.itemCode}-${index}`} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.itemName}</Text>
              <Text style={styles.itemMeta}>Codigo: {item.itemCode || 'N/D'}</Text>
              <Text style={styles.itemMeta}>Quantidade: {item.qtdItem}</Text>
              <Text style={styles.itemMeta}>Unidade: {item.unItem}</Text>
              <Text style={styles.itemValue}>{formatCurrency(item.itemValue)}</Text>
            </AppCard>
          ))}
        </View>
      ) : (
        <AppCard style={styles.emptyItemsCard}>
          <Text style={styles.emptyItemsTitle}>Nenhum item encontrado</Text>
          <Text style={styles.emptyItemsText}>
            Esta nota foi salva sem itens detalhados ou os dados retornados vieram incompletos.
          </Text>
        </AppCard>
      )}

      <AppCard style={styles.footerCard}>
        <Text style={styles.footerText}>Base de calculo: {formatCurrency(invoice.icmsCalculationBasis)}</Text>
        <Text style={styles.footerText}>Valor ICMS: {formatCurrency(invoice.icmsValue)}</Text>
        <Text style={styles.footerStrong}>Itens totais: {invoice.totalItems}</Text>
        <Text style={styles.footerStrong}>Valor total: {formatCurrency(invoice.totalValue)}</Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
  },
  summaryCard: {
    gap: 8,
  },
  summaryLabel: {
    color: colors.slate500,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  summaryText: {
    color: colors.ink800,
    lineHeight: 21,
  },
  sectionTitle: {
    color: colors.ink900,
    fontSize: 24,
    fontWeight: '800',
  },
  itemsList: {
    gap: spacing.md,
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
    color: colors.amber700,
    fontWeight: '800',
    marginTop: 4,
  },
  emptyItemsCard: {
    gap: spacing.xs,
    backgroundColor: colors.surfaceStrong,
  },
  emptyItemsTitle: {
    color: colors.ink900,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyItemsText: {
    color: colors.ink800,
    lineHeight: 21,
  },
  footerCard: {
    gap: 8,
    backgroundColor: colors.surfaceStrong,
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
