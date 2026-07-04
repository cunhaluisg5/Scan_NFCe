import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { LoadingBlock } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <LoadingBlock message="Preparando sua area..." />;
  }

  return (
    <NavigationContainer>
      {status === 'authenticated' ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
