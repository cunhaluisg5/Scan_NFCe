import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Header from '../components/Header/Header';
import Settings from '../screens/Settings/Settings';

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
    headerTintColor: '#444',
    headerStyle: { backgroundColor: '#ccc', height: 60 },
  }
});

export default SettingsStack;