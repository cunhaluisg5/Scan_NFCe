import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { EmptyState, LoadingBlock, Screen } from '../components/ui';
import { api } from '../services/Api';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, radius, shadow, spacing } from '../theme';
import { formatCurrency } from '../utils/format';
import { groupInvoicesByStore } from '../utils/nfce';

export function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/nfces/user/${user._id || user.id}`);
      setStores(groupInvoicesByStore(response.nfces || []));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => {
    load();
  }, [load]));

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
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Painel de compras</Text>
            <Text style={styles.title}>Suas notas agrupadas por estabelecimento</Text>
          </View>
        )}
        ListEmptyComponent={(
          <EmptyState
            title="Nenhuma nota por aqui"
            description="Use o leitor de QR Code para importar sua primeira NFC-e."
          />
        )}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('NotesByStore', { title: item.name, invoices: item.invoices })}
          >
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
  header: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.teal700,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  title: {
    color: colors.ink900,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 38,
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
    minHeight: 220,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.08)',
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow,
  },
  cardTitle: {
    color: colors.ink900,
    fontSize: 18,
    fontFamily: fonts.heading,
  },
  cardMeta: {
    color: colors.slate500,
    fontSize: 14,
  },
  cardImage: {
    width: '100%',
    height: 80,
  },
  cardTotal: {
    color: colors.amber600,
    fontSize: 16,
    fontWeight: '800',
  },
});
