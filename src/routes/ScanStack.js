import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Header from '../components/Header/Header';
import Scan from '../components/ScanCode/Scan';

import { AppColors } from '../colors/AppColors';

const screens = {
  Scan: {
    screen: Scan,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header title='Leitor de Código' navigation={ navigation } />
      }
    },
  },
}

const ScanStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: AppColors.header,
    headerStyle: { backgroundColor: AppColors.backgroundHeader, height: 60 },
  }
});

export default ScanStack;