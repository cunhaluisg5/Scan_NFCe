import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  EmptyState,
  LoadingBlock,
  MetricCard,
  PrimaryButton,
  Screen,
  SectionHeader,
  StatusBanner,
} from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../navigation/routeNames';
import { api } from '../services/Api';
import { colors, radius, shadow, spacing } from '../theme';
import { formatCurrency } from '../utils/format';
import { groupInvoicesByStore } from '../utils/nfce';

export function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await api.get(`/nfces/user/${user._id || user.id}`);
      setStores(groupInvoicesByStore(response.nfces || []));
    } catch (error) {
      setStores([]);
      setErrorMessage(error.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => {
    load();
  }, [load]));

  const summary = useMemo(() => {
    const invoiceCount = stores.reduce((total, store) => total + store.invoices.length, 0);
    const total = stores.reduce((acc, store) => acc + store.total, 0);

    return {
      storeCount: stores.length,
      invoiceCount,
      total,
    };
  }, [stores]);

  if (loading) {
    return <LoadingBlock message="Buscando suas notas..." />;
  }

  return (
    <Screen>
      <FlatList
        data={stores}
        numColumns={2}
        contentContainerStyle={stores.length ? styles.list : { flexGrow: 1, justifyContent: 'center' }}
        columnWrapperStyle={stores.length ? styles.row : undefined}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={(
          <>
            <View style={styles.heroCard}>
              <View style={styles.heroText}>
                <SectionHeader
                  eyebrow="Painel principal"
                  title={`Bem-vindo, ${user?.name?.split(' ')[0] || 'Usuário'}`}
                  description="Acompanhe suas compras, abra suas notas por estabelecimento e acesse rapidamente o leitor."
                  eyebrowStyle={styles.heroEyebrow}
                  titleStyle={styles.heroTitle}
                  descriptionStyle={styles.heroDescription}
                />
                <PrimaryButton
                  title="Ler nova nota"
                  onPress={() => navigation.navigate(ROUTES.APP.SCAN)}
                  style={styles.heroButton}
                />
              </View>
              <Image source={require('../../assets/bags.png')} style={styles.heroImage} resizeMode="contain" />
            </View>

            <View style={styles.metricsGrid}>
              <MetricCard label="Estabelecimentos" value={String(summary.storeCount)} />
              <MetricCard label="Notas salvas" value={String(summary.invoiceCount)} tone="amber" />
              <MetricCard label="Total acumulado" value={formatCurrency(summary.total)} tone="coral" style={styles.metricWide} />
            </View>

            {errorMessage ? (
              <StatusBanner
                title="Não foi possível carregar"
                message={errorMessage}
                tone="error"
                actionLabel="Tentar novamente"
                onAction={load}
              />
            ) : null}

            <SectionHeader
              eyebrow="Seus agrupamentos"
              title="Notas por estabelecimento"
              description="Toque em um card para abrir as notas daquele mercado e ver os detalhes da compra."
              style={styles.storeHeader}
            />
          </>
        )}
        ListEmptyComponent={(
          errorMessage ? (
            <View style={styles.retryWrap}>
              <PrimaryButton title="Tentar novamente" onPress={load} />
            </View>
          ) : (
            <EmptyState
              title="Nenhuma nota por aqui"
              description="Use o leitor de QR Code para importar sua primeira NFC-e."
            />
          )
        )}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate(ROUTES.APP.NOTES_BY_STORE, { title: item.name, invoices: item.invoices })}
          >
            <Text style={styles.cardLabel}>Estabelecimento</Text>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.name.toUpperCase()}</Text>
            <Text style={styles.cardMeta}>Qtde. de notas: {item.invoices.length}</Text>
            <Image source={require('../../assets/bags.png')} style={styles.cardImage} resizeMode="contain" />
            <Text style={styles.cardTotal}>{formatCurrency(item.total)}</Text>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    backgroundColor: colors.ink950,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: spacing.md,
  },
  heroText: {
    flex: 1,
    gap: spacing.lg,
  },
  heroButton: {
    alignSelf: 'flex-start',
    minWidth: 180,
  },
  heroEyebrow: {
    color: 'rgba(255, 255, 255, 0.72)',
  },
  heroTitle: {
    color: colors.white,
  },
  heroDescription: {
    color: 'rgba(255, 255, 255, 0.82)',
  },
  heroImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  metricWide: {
    width: '100%',
  },
  storeHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  list: {
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  row: {
    gap: spacing.md,
  },
  retryWrap: {
    marginTop: spacing.md,
  },
  card: {
    flex: 1,
    minHeight: 240,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow,
  },
  cardLabel: {
    color: colors.slate500,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: colors.ink900,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  cardMeta: {
    color: colors.slate500,
    fontSize: 14,
  },
  cardImage: {
    width: '100%',
    height: 84,
  },
  cardTotal: {
    color: colors.amber700,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 'auto',
  },
});
