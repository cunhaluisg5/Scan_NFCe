import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Header from '../components/Header/Header';
import Chart from '../components/Chart/Chart';

import { AppColors } from '../colors/AppColors';

const screens = {
  Chart: {
    screen: Chart,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header title='Análise de Gastos' navigation={ navigation } />
      }
    },
  },
}

const ChartStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: AppColors.header,
    headerStyle: { backgroundColor: AppColors.backgroundHeader, height: 60 },
  }
});

export default ChartStack;