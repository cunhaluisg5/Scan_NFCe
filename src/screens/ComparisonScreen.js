import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  AppCard,
  EmptyState,
  LoadingBlock,
  MetricCard,
  PrimaryButton,
  Screen,
  SectionHeader,
  SelectModal,
  StatusBanner,
} from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/Api';
import { colors, radius, spacing } from '../theme';
import { getMonthLabel, getMonthOptions, formatDateTime, parseBrazilianDate } from '../utils/date';
import { formatCurrency, toNumber } from '../utils/format';

export function ComparisonScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await api.get(`/nfces/user/${user._id || user.id}`);
      setInvoices(response.nfces || []);
    } catch (error) {
      setInvoices([]);
      setErrorMessage(error.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => {
    load();
  }, [load]));

  const monthInvoices = useMemo(() => {
    if (!selectedMonth) {
      return [];
    }

    return invoices.filter((invoice) => {
      const date = parseBrazilianDate(invoice.issuanceDate);
      return date ? String(date.getMonth() + 1) === selectedMonth : false;
    });
  }, [invoices, selectedMonth]);

  const itemOptions = useMemo(() => {
    const names = new Set();
    monthInvoices.forEach((invoice) => {
      (invoice.items || []).forEach((item) => names.add(item.itemName));
    });

    return Array.from(names).sort((a, b) => a.localeCompare(b)).map((name) => ({
      label: name,
      value: name,
    }));
  }, [monthInvoices]);

  const monthSummary = useMemo(() => ({
    invoices: monthInvoices.length,
    items: monthInvoices.reduce((sum, invoice) => sum + (invoice.items?.length || 0), 0),
    total: monthInvoices.reduce((sum, invoice) => sum + toNumber(invoice.totalValue), 0),
    icms: monthInvoices.reduce((sum, invoice) => sum + toNumber(invoice.icmsValue), 0),
  }), [monthInvoices]);

  const filteredEntries = useMemo(() => {
    if (!selectedItem) {
      return [];
    }

    return monthInvoices
      .map((invoice) => ({
        invoice,
        items: (invoice.items || []).filter((item) => item.itemName === selectedItem),
      }))
      .filter((entry) => entry.items.length > 0);
  }, [monthInvoices, selectedItem]);

  if (loading) {
    return <LoadingBlock message="Comparando seus produtos..." />;
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="Comparacao de produtos"
        title="Encontre variacao de preco"
        description="Selecione um mes, escolha um item e veja em quais notas ele apareceu para comparar valores."
      />

      {errorMessage ? (
        <StatusBanner
          title="Nao foi possivel carregar"
          message={errorMessage}
          tone="error"
          actionLabel="Tentar novamente"
          onAction={load}
        />
      ) : null}

      <View style={styles.metrics}>
        <MetricCard
          label="Mes selecionado"
          value={selectedMonth ? getMonthLabel(Number(selectedMonth)).short : 'Nenhum'}
        />
        <MetricCard
          label="Item selecionado"
          value={selectedItem || 'Nenhum'}
          tone="amber"
        />
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title={selectedMonth ? getMonthLabel(Number(selectedMonth)).full : 'Selecionar mes'}
          onPress={() => setMonthModalVisible(true)}
          style={styles.actionButton}
        />

        <PrimaryButton
          title={selectedItem || 'Selecionar item'}
          onPress={() => setItemModalVisible(true)}
          disabled={!itemOptions.length}
          tone="secondary"
          style={styles.actionButton}
        />
      </View>

      {selectedMonth ? (
        <AppCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo do recorte</Text>
          <Text style={styles.summaryText}>Total de notas: {monthSummary.invoices}</Text>
          <Text style={styles.summaryText}>Total de itens: {monthSummary.items}</Text>
          <Text style={styles.summaryText}>Valor total de compra: {formatCurrency(monthSummary.total)}</Text>
          <Text style={styles.summaryText}>Valor total de ICMS: {formatCurrency(monthSummary.icms)}</Text>
        </AppCard>
      ) : null}

      {selectedMonth && selectedItem ? (
        filteredEntries.length ? filteredEntries.map(({ invoice, items }) => (
          <AppCard key={invoice._id || invoice.id || invoice.accesskey} style={styles.invoiceCard}>
            <Text style={styles.invoiceTitle}>{invoice.socialName?.toUpperCase()}</Text>
            {items.map((item, index) => (
              <View key={`${item.itemCode}-${index}`} style={styles.itemBlock}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemMeta}>Codigo: {item.itemCode}</Text>
                <Text style={styles.itemMeta}>Valor: {formatCurrency(item.itemValue)}</Text>
              </View>
            ))}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Data de compra: {invoice.issuanceDate}</Text>
              <Text style={styles.footerText}>Data de leitura: {formatDateTime(invoice.createdAt)}</Text>
            </View>
          </AppCard>
        )) : (
          <EmptyState
            title="Nenhuma ocorrencia"
            description="Esse item nao apareceu nas notas do mes selecionado."
          />
        )
      ) : (
        <EmptyState
          title="Escolha um recorte"
          description="Selecione primeiro o mes e depois o produto para iniciar a comparacao."
        />
      )}

      <SelectModal
        visible={monthModalVisible}
        title="Selecione um mes"
        options={getMonthOptions()}
        onSelect={(value) => {
          setSelectedMonth(value);
          setSelectedItem(null);
          setMonthModalVisible(false);
        }}
        onClose={() => setMonthModalVisible(false)}
      />

      <SelectModal
        visible={itemModalVisible}
        title="Selecione um item"
        options={itemOptions}
        onSelect={(value) => {
          setSelectedItem(value);
          setItemModalVisible(false);
        }}
        onClose={() => setItemModalVisible(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actions: {
    gap: spacing.sm,
  },
  actionButton: {
    minHeight: 50,
  },
  summaryCard: {
    gap: spacing.xs,
  },
  summaryTitle: {
    color: colors.ink900,
    fontSize: 22,
    fontWeight: '800',
  },
  summaryText: {
    color: colors.ink800,
  },
  invoiceCard: {
    gap: spacing.md,
  },
  invoiceTitle: {
    color: colors.ink900,
    fontSize: 21,
    fontWeight: '800',
  },
  itemBlock: {
    backgroundColor: colors.surfaceStrong,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  itemName: {
    color: colors.ink900,
    fontWeight: '800',
  },
  itemMeta: {
    color: colors.slate500,
  },
  footer: {
    gap: 4,
  },
  footerText: {
    color: colors.ink800,
    fontSize: 13,
  },
});
