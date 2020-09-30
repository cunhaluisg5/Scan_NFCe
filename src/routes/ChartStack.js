import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Header from '../components/Header/Header';
import Chart from '../components/Chart/Chart';

const screens = {
  Chart: {
    screen: Chart,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header title='Total Gasto' navigation={navigation} />
      }
    },
  },
}

const ChartStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: '#444',
    headerStyle: { backgroundColor: '#eee', height: 60 },
  }
});

export default ChartStack;