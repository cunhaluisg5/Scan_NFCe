import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { InvoiceDetailsScreen } from '../screens/InvoiceDetailsScreen';
import { NotesByStoreScreen } from '../screens/NotesByStoreScreen';
import { colors, fonts } from '../theme';
import { DrawerNavigator } from './DrawerNavigator';
import { ROUTES } from './routeNames';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.ink900 },
        headerTintColor: colors.white,
        headerTitleStyle: { fontFamily: fonts.heading, fontSize: 22 },
      }}
    >
      <Stack.Screen
        name={ROUTES.APP.ROOT}
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.APP.NOTES_BY_STORE}
        component={NotesByStoreScreen}
        options={{ title: 'Notas' }}
      />
      <Stack.Screen
        name={ROUTES.APP.INVOICE_DETAILS}
        component={InvoiceDetailsScreen}
        options={{ title: 'Detalhes da Nota' }}
      />
    </Stack.Navigator>
  );
}
