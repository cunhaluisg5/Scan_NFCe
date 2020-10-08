import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Header from '../components/Header/Header';
import Scan from '../components/ScanCode/Scan';

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
    headerTintColor: '#444',
    headerStyle: { backgroundColor: '#ccc', height: 60 },
  }
});

export default ScanStack;