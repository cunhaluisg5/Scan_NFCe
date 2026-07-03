import React, { useMemo } from 'react';
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
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
import { LoadingBlock } from '../components/ui';
import { colors, fonts, spacing } from '../theme';
import { AuthScreen } from '../screens/AuthScreen';
import { ComparisonScreen } from '../screens/ComparisonScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { InvoiceDetailsScreen } from '../screens/InvoiceDetailsScreen';
import { NotesByStoreScreen } from '../screens/NotesByStoreScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SpendingScreen } from '../screens/SpendingScreen';

const RootStack = createNativeStackNavigator();
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

function DrawerContent(props) {
  const { user, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
      <View style={styles.drawerTop}>
        <Image source={require('../../assets/logo.png')} style={styles.drawerLogo} resizeMode="contain" />
        <Text style={styles.drawerName}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.drawerEmail}>{user?.email || ''}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      <DrawerItem
        label="Sair"
        labelStyle={{ color: colors.red500, fontWeight: '700' }}
        onPress={signOut}
      />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  const screenOptions = useMemo(() => ({
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
  }), []);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={screenOptions}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Drawer.Screen name="Scan" component={ScanScreen} options={{ title: 'Leitor de Código' }} />
      <Drawer.Screen name="Spending" component={SpendingScreen} options={{ title: 'Análise de Gastos' }} />
      <Drawer.Screen name="Comparison" component={ComparisonScreen} options={{ title: 'Análise de Produtos' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
    </Drawer.Navigator>
  );
}

function AuthNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="AuthScreen" component={AuthScreen} />
      <RootStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
    </RootStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.ink900 },
        headerTintColor: colors.white,
        headerTitleStyle: { fontFamily: fonts.heading, fontSize: 22 },
      }}
    >
      <RootStack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
      <RootStack.Screen name="NotesByStore" component={NotesByStoreScreen} options={{ title: 'Notas' }} />
      <RootStack.Screen name="InvoiceDetails" component={InvoiceDetailsScreen} options={{ title: 'Detalhes da Nota' }} />
    </RootStack.Navigator>
  );
}

export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <LoadingBlock message="Preparando sua área..." />;
  }

  return (
    <NavigationContainer>
      {status === 'authenticated' ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
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
});
