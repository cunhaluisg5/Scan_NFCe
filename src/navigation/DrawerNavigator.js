import React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { ComparisonScreen } from '../screens/ComparisonScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SpendingScreen } from '../screens/SpendingScreen';
import { colors, fonts, radius, spacing } from '../theme';
import { ROUTES } from './routeNames';

const Drawer = createDrawerNavigator();

function MenuTrigger() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={styles.menuButton}
    >
      <Text style={styles.menuText}>Explorar</Text>
    </Pressable>
  );
}

function AppDrawerContent(props) {
  const { user, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
      <View style={styles.drawerHero}>
        <View style={styles.drawerBrandRow}>
          <Image source={require('../../assets/logo.png')} style={styles.drawerLogo} resizeMode="contain" />
          <View style={styles.drawerCopy}>
            <Text style={styles.drawerEyebrow}>Scan NFC-e</Text>
            <Text style={styles.drawerName}>{user?.name || 'Usuario'}</Text>
            <Text style={styles.drawerEmail}>{user?.email || ''}</Text>
          </View>
        </View>
        <Text style={styles.drawerHint}>Organize suas notas, acompanhe gastos e compare produtos.</Text>
      </View>

      <View style={styles.drawerBody}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.drawerFooter}>
        <DrawerItem label="Sair da conta" labelStyle={styles.drawerExitLabel} onPress={signOut} />
      </View>
    </DrawerContentScrollView>
  );
}

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.ink950,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontFamily: fonts.heading,
          fontSize: 22,
        },
        headerShadowVisible: false,
        headerLeft: () => <MenuTrigger />,
        drawerActiveTintColor: colors.teal700,
        drawerInactiveTintColor: colors.ink800,
        drawerLabelStyle: {
          marginLeft: -12,
          fontWeight: '700',
          fontSize: 15,
        },
        drawerActiveBackgroundColor: 'rgba(20, 184, 166, 0.12)',
        drawerInactiveBackgroundColor: 'transparent',
        drawerStyle: {
          backgroundColor: colors.surface,
          width: 320,
        },
      }}
    >
      <Drawer.Screen
        name={ROUTES.APP.HOME}
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Drawer.Screen
        name={ROUTES.APP.SCAN}
        component={ScanScreen}
        options={{ title: 'Leitor de Codigo' }}
      />
      <Drawer.Screen
        name={ROUTES.APP.SPENDING}
        component={SpendingScreen}
        options={{ title: 'Analise de Gastos' }}
      />
      <Drawer.Screen
        name={ROUTES.APP.COMPARISON}
        component={ComparisonScreen}
        options={{ title: 'Analise de Produtos' }}
      />
      <Drawer.Screen
        name={ROUTES.APP.SETTINGS}
        component={SettingsScreen}
        options={{ title: 'Configuracoes' }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  menuText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.4,
  },
  drawerScroll: {
    flex: 1,
  },
  drawerHero: {
    margin: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.ink950,
    gap: spacing.md,
  },
  drawerBrandRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  drawerLogo: {
    width: 74,
    height: 74,
  },
  drawerCopy: {
    flex: 1,
    gap: 2,
  },
  drawerEyebrow: {
    color: '#C7F9F2',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  drawerName: {
    color: colors.white,
    fontSize: 22,
    fontFamily: fonts.heading,
  },
  drawerEmail: {
    color: '#D7E2F0',
    fontSize: 13,
  },
  drawerHint: {
    color: '#D7E2F0',
    lineHeight: 20,
  },
  drawerBody: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
    paddingTop: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  drawerExitLabel: {
    color: colors.red500,
    fontWeight: '700',
    fontSize: 15,
  },
});
