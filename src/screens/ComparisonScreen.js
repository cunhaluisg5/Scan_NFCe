import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  AppCard,
  EmptyState,
  LoadingBlock,
  PrimaryButton,
  Screen,
  SelectModal,
} from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/Api';
import { colors, fonts, radius, spacing } from '../theme';
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

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/nfces/user/${user._id || user.id}`);
      setInvoices(response.nfces || []);
    } catch (error) {
      Alert.alert('Atenção', error.data?.error || error.message);
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
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Análise por produto</Text>
        <Text style={styles.title}>Cruze preços por mês e veja onde cada item apareceu</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title={selectedMonth ? getMonthLabel(Number(selectedMonth)).full : 'Selecionar mês'}
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
          <Text style={styles.summaryTitle}>Detalhes do mês</Text>
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
                <Text style={styles.itemMeta}>Código: {item.itemCode}</Text>
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
            title="Nenhuma ocorrência"
            description="Esse item não apareceu nas notas do mês selecionado."
          />
        )
      ) : (
        <EmptyState
          title="Escolha um recorte"
          description="Selecione primeiro o mês e depois o produto para iniciar a comparação."
        />
      )}

      <SelectModal
        visible={monthModalVisible}
        title="Selecione um mês"
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
  header: {
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.teal700,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.7,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 38,
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
    fontFamily: fonts.heading,
    fontSize: 22,
  },
  summaryText: {
    color: colors.ink800,
  },
  invoiceCard: {
    gap: spacing.md,
  },
  invoiceTitle: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 21,
  },
  itemBlock: {
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
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
