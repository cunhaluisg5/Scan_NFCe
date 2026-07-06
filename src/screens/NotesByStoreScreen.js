import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EmptyState, MetricCard, Screen, SectionHeader } from '../components/ui';
import { ROUTES } from '../navigation/routeNames';
import { colors, radius, shadow, spacing } from '../theme';
import { formatCurrency } from '../utils/format';
import { formatDate, parseBrazilianDate } from '../utils/date';

export function NotesByStoreScreen({ navigation, route }) {
  const invoices = useMemo(() => [...(route.params?.invoices || [])].sort((a, b) => {
    const dateA = parseBrazilianDate(a.createdAt);
    const dateB = parseBrazilianDate(b.createdAt);
    const timeA = dateA ? dateA.getTime() : 0;
    const timeB = dateB ? dateB.getTime() : 0;
    return timeB - timeA;
  }), [route.params?.invoices]);

  const totalAmount = invoices.reduce((sum, item) => sum + Number(item.totalValue || 0), 0);

  return (
    <Screen>
      <FlatList
        data={invoices}
        numColumns={2}
        contentContainerStyle={invoices.length ? styles.list : { flexGrow: 1, justifyContent: 'center' }}
        columnWrapperStyle={invoices.length ? styles.row : undefined}
        keyExtractor={(item) => item._id || item.id || item.accesskey}
        ListHeaderComponent={(
          <>
            <SectionHeader
              eyebrow="Detalhamento"
              title={route.params?.title || 'Notas'}
              description="Confira as notas lidas neste estabelecimento e toque em uma delas para ver os itens."
            />
            <View style={styles.metrics}>
              <MetricCard label="Notas listadas" value={String(invoices.length)} />
              <MetricCard label="Valor somado" value={formatCurrency(totalAmount)} tone="amber" />
            </View>
          </>
        )}
        ListEmptyComponent={(
          <EmptyState title="Sem notas" description="Nenhuma nota encontrada para este estabelecimento." />
        )}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate(ROUTES.APP.INVOICE_DETAILS, { invoice: item, mode: 'saved' })}
          >
            <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.socialName?.toUpperCase()}</Text>
            <Image source={require('../../assets/nfce.png')} style={styles.cardImage} resizeMode="contain" />
            <View style={styles.cardFooter}>
              <Text style={styles.cardMeta}>Emissao: {item.issuanceDate}</Text>
              <Text style={styles.cardMeta}>Itens: {item.totalItems}</Text>
            </View>
            <Text style={styles.cardTotal}>{formatCurrency(item.totalValue)}</Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  list: {
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  row: {
    gap: spacing.md,
  },
  card: {
    flex: 1,
    minHeight: 258,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: spacing.xs,
    ...shadow,
  },
  cardDate: {
    color: colors.slate500,
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    color: colors.ink900,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  cardImage: {
    width: '100%',
    height: 76,
    marginVertical: spacing.xs,
  },
  cardFooter: {
    gap: 4,
  },
  cardMeta: {
    color: colors.ink800,
    fontSize: 13,
  },
  cardTotal: {
    color: colors.teal700,
    fontWeight: '800',
    fontSize: 18,
    marginTop: 'auto',
  },
});
