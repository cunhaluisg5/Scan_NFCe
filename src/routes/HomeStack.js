import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import Header from '../components/Header/Header';
import HomeScreen from '../screens/Home/HomeScreen';
import DetailsNfceScreen from '../screens/DetailsNfce/DetailsNfceScreen';

const screens = {
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Header title='Início' navigation={navigation} />
      }
    },
  },
  DetailsNfceScreen: {
    screen: DetailsNfceScreen,
    navigationOptions: {
      title: 'Detalhes da NFCe'
    }
  },
};

// home stack navigator screens
const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: '#444',
    headerStyle: { backgroundColor: '#eee', height: 60 }
  }
});

export default HomeStack;


