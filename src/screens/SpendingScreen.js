import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { AppCard, EmptyState, LoadingBlock, MetricCard, PillSelector, Screen, SectionHeader, StatusBanner } from '../components/ui';
import { SimpleLineChart } from '../components/SimpleLineChart';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../navigation/routeNames';
import { api } from '../services/Api';
import { colors, spacing } from '../theme';
import { getPeriodBreakdown, getMostExpensiveInvoices, buildTimeline, normalizeInvoicesCollection } from '../utils/nfce';
import { formatCurrency } from '../utils/format';

const OPTIONS = [
  { label: 'Dia', value: 'day' },
  { label: 'Mes', value: 'month' },
  { label: 'Ano', value: 'year' },
];

export function SpendingScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [timeframe, setTimeframe] = useState('month');
  const [errorMessage, setErrorMessage] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await api.get(`/nfces/user/${user._id || user.id}`);
      setInvoices(normalizeInvoicesCollection(response.nfces || []));
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

  const timeline = useMemo(() => buildTimeline(invoices, timeframe), [invoices, timeframe]);
  const expensiveInvoices = useMemo(() => getMostExpensiveInvoices(invoices, timeframe), [invoices, timeframe]);
  const breakdown = useMemo(() => getPeriodBreakdown(invoices, timeframe), [invoices, timeframe]);
  const highlightedTotal = useMemo(() => timeline.values.reduce((sum, value) => sum + value, 0), [timeline.values]);

  if (loading) {
    return <LoadingBlock message="Montando a análise..." />;
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <SectionHeader
        eyebrow="Análise temporal"
        title="Veja seus gastos por período"
        description="Acompanhe a evolução das compras, identifique picos de gasto e abra a nota mais cara do recorte."
      />

      {errorMessage ? (
        <StatusBanner
          title="Não foi possível carregar"
          message={errorMessage}
          tone="error"
          actionLabel="Tentar novamente"
          onAction={load}
        />
      ) : null}

      <View style={styles.metrics}>
        <MetricCard label="Notas no recorte" value={String(expensiveInvoices.length)} />
        <MetricCard label="Total observado" value={formatCurrency(highlightedTotal)} tone="amber" />
      </View>

      <PillSelector options={OPTIONS} value={timeframe} onChange={setTimeframe} />

      <AppCard style={styles.chartCard}>
        <Text style={styles.cardTitle}>Linha de gastos</Text>
        <SimpleLineChart labels={timeline.labels} values={timeline.values} />
      </AppCard>

      <SectionHeader
        eyebrow="Destaque"
        title="Notas com maior impacto"
        description="As notas abaixo representam os maiores valores encontrados no período selecionado."
      />

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
          <SectionHeader
            eyebrow="Resumo"
            title="Fechamento do período"
            description="Cada card resume a quantidade de notas e o valor acumulado naquele grupo."
          />
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
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  chartCard: {
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.ink900,
    fontSize: 20,
    fontWeight: '800',
  },
  invoiceCard: {
    gap: 6,
  },
  invoiceTitle: {
    color: colors.ink900,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
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
