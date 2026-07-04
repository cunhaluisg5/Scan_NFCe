import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { AppCard, EmptyState, LoadingBlock, PillSelector, Screen } from '../components/ui';
import { SimpleLineChart } from '../components/SimpleLineChart';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../navigation/routeNames';
import { api } from '../services/Api';
import { colors, fonts, spacing } from '../theme';
import { getPeriodBreakdown, getMostExpensiveInvoices, buildTimeline } from '../utils/nfce';
import { formatCurrency } from '../utils/format';

const OPTIONS = [
  { label: 'Dia', value: 'day' },
  { label: 'Mês', value: 'month' },
  { label: 'Ano', value: 'year' },
];

export function SpendingScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [timeframe, setTimeframe] = useState('month');

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

  const timeline = useMemo(() => buildTimeline(invoices, timeframe), [invoices, timeframe]);
  const expensiveInvoices = useMemo(() => getMostExpensiveInvoices(invoices, timeframe), [invoices, timeframe]);
  const breakdown = useMemo(() => getPeriodBreakdown(invoices, timeframe), [invoices, timeframe]);

  if (loading) {
    return <LoadingBlock message="Montando a análise..." />;
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Análise temporal</Text>
        <Text style={styles.title}>Veja seus gastos por dia, mês e ano</Text>
      </View>

      <PillSelector options={OPTIONS} value={timeframe} onChange={setTimeframe} />

      <SimpleLineChart labels={timeline.labels} values={timeline.values} />

      <Text style={styles.sectionTitle}>Nota mais cara no período</Text>
      {expensiveInvoices.length ? expensiveInvoices.map((invoice) => (
        <Pressable
          key={invoice._id || invoice.id || invoice.accesskey}
          onPress={() => navigation.navigate(ROUTES.APP.INVOICE_DETAILS, { invoice, mode: 'saved' })}
        >
          <AppCard style={styles.invoiceCard}>
            <Text style={styles.invoiceTitle}>{invoice.socialName?.toUpperCase()}</Text>
            <Text style={styles.invoiceText}>CNPJ: {invoice.cnpj}</Text>
            <Text style={styles.invoiceText}>UF: {invoice.uf}</Text>
            <Text style={styles.invoiceText}>Data de emissão: {invoice.issuanceDate}</Text>
            <Text style={styles.invoiceValue}>{formatCurrency(invoice.totalValue)}</Text>
          </AppCard>
        </Pressable>
      )) : (
        <EmptyState title="Sem dados no período" description="Ainda não há compras suficientes para esta análise." />
      )}

      {(timeframe === 'month' || timeframe === 'year') ? (
        <>
          <Text style={styles.sectionTitle}>Resumo do período</Text>
          <View style={styles.breakdownList}>
            {breakdown.map((item) => (
              <AppCard key={item.label} style={styles.breakdownCard}>
                <Text style={styles.breakdownTitle}>{item.label}</Text>
                <Text style={styles.invoiceText}>Total de notas: {item.count}</Text>
                <Text style={styles.breakdownValue}>{formatCurrency(item.total)}</Text>
              </AppCard>
            ))}
          </View>
        </>
      ) : null}
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
    color: colors.amber600,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 38,
  },
  sectionTitle: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  invoiceCard: {
    gap: 6,
  },
  invoiceTitle: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 20,
  },
  invoiceText: {
    color: colors.ink800,
  },
  invoiceValue: {
    color: colors.coral500,
    fontWeight: '800',
    fontSize: 18,
    marginTop: spacing.xs,
  },
  breakdownList: {
    gap: spacing.md,
  },
  breakdownCard: {
    gap: 6,
  },
  breakdownTitle: {
    color: colors.ink900,
    fontWeight: '800',
    fontSize: 16,
  },
  breakdownValue: {
    color: colors.teal700,
    fontWeight: '800',
  },
});
