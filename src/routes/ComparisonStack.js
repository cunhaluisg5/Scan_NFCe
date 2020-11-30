import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Header from '../components/Header/Header';
import Comparison from '../screens/ProductComparison/Comparison';

import { AppColors } from '../colors/AppColors';

const screens = {
    Comparison: {
    screen: Comparison,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header title='Análise de Produtos' navigation={ navigation } />
      }
    },
  },
}

const ComparisonStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: AppColors.header,
    headerStyle: { backgroundColor: AppColors.backgroundHeader, height: 60 },
  }
});

export default ComparisonStack;