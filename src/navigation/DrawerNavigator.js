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
import { colors, fonts, spacing } from '../theme';
import { ROUTES } from './routeNames';

const Drawer = createDrawerNavigator();

function MenuTrigger() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={styles.menuButton}
    >
      <Text style={styles.menuText}>Menu</Text>
    </Pressable>
  );
}

function AppDrawerContent(props) {
  const { user, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
      <View style={styles.drawerTop}>
        <Image source={require('../../assets/logo.png')} style={styles.drawerLogo} resizeMode="contain" />
        <Text style={styles.drawerName}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.drawerEmail}>{user?.email || ''}</Text>
      </View>

      <View style={styles.drawerBody}>
        <DrawerItemList {...props} />
      </View>

      <DrawerItem label="Sair" labelStyle={styles.drawerExitLabel} onPress={signOut} />
    </DrawerContentScrollView>
  );
}

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.ink900,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontFamily: fonts.heading,
          fontSize: 22,
        },
        headerLeft: () => <MenuTrigger />,
        drawerActiveTintColor: colors.teal700,
        drawerInactiveTintColor: colors.ink800,
        drawerLabelStyle: {
          marginLeft: -12,
          fontWeight: '700',
        },
        drawerStyle: {
          backgroundColor: colors.surface,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  menuText: {
    color: colors.white,
    fontWeight: '700',
  },
  drawerScroll: {
    flex: 1,
  },
  drawerTop: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  drawerBody: {
    flex: 1,
  },
  drawerLogo: {
    width: 112,
    height: 112,
    marginBottom: spacing.sm,
  },
  drawerName: {
    color: colors.ink900,
    fontSize: 22,
    fontFamily: fonts.heading,
  },
  drawerEmail: {
    color: colors.slate500,
    fontSize: 14,
  },
  drawerExitLabel: {
    color: colors.red500,
    fontWeight: '700',
  },
});
