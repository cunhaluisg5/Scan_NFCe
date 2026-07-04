import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { EmptyState, Screen } from '../components/ui';
import { ROUTES } from '../navigation/routeNames';
import { colors, fonts, radius, shadow, spacing } from '../theme';
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

  return (
    <Screen>
      <FlatList
        data={invoices}
        numColumns={2}
        contentContainerStyle={invoices.length ? styles.list : { flexGrow: 1, justifyContent: 'center' }}
        columnWrapperStyle={invoices.length ? styles.row : undefined}
        keyExtractor={(item) => item._id || item.id || item.accesskey}
        ListHeaderComponent={(
          <Text style={styles.header}>{route.params?.title || 'Notas'}</Text>
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
            <Text style={styles.cardMeta}>Emissão: {item.issuanceDate}</Text>
            <Text style={styles.cardMeta}>Itens: {item.totalItems}</Text>
            <Text style={styles.cardTotal}>{formatCurrency(item.totalValue)}</Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 28,
    marginBottom: spacing.lg,
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
    minHeight: 250,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.08)',
    gap: spacing.xs,
    ...shadow,
  },
  cardDate: {
    color: colors.slate500,
    fontSize: 12,
  },
  cardTitle: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  cardImage: {
    width: '100%',
    height: 72,
    marginVertical: spacing.xs,
  },
  cardMeta: {
    color: colors.ink800,
    fontSize: 13,
  },
  cardTotal: {
    color: colors.teal700,
    fontWeight: '800',
    marginTop: 'auto',
  },
});
