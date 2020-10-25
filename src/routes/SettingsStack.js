import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Header from '../components/Header/Header';
import Settings from '../screens/Settings/Settings';

import { AppColors } from '../colors/AppColors';

const screens = {
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header title='Configurações' navigation={ navigation } />
      }
    },
  },
}

const SettingsStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: AppColors.header,
    headerStyle: { backgroundColor: AppColors.backgroundHeader, height: 60 },
  }
});

export default SettingsStack;