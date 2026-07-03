import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from './context/AuthContext';
import { RootNavigator } from './navigation/RootNavigator';
import { colors } from './theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <AuthProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.ink900} />
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
