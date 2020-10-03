import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import { Alert } from 'react-native';
import Header from '../components/Header/Header';
import HomeScreen from '../screens/Home/HomeScreen';
import DetailsNfceScreen from '../screens/DetailsNfce/DetailsNfceScreen';

import MenuButton from '../components/MenuButton/MenuButton';
import Api from '../services/Api';

const gravar = async (nfce, navigation) => {
  try {
    const response = await Api.post('/nfces', nfce).then((data) => {
      console.log('Salvo com sucesso!')
    })

    Alert.alert('Atenção', 'Salvo com sucesso!');
    navigation.navigate('HomeScreen');
  } catch (err) {
    console.log('Erro ao salvar ', err.data.error)
    Alert.alert('Atenção', err.data.error)
  }
}

const remover = async (nfce, navigation) => {
  try {
    const response = await Api.delete('/nfces/' + nfce._id);

    navigation.navigate('HomeScreen');
    Alert.alert('Atenção', 'Excluído com sucesso!');
  } catch (err) {
    console.log('Erro ao excluir ', err)
    Alert.alert('Atenção', 'Erro ao excluir');
  }
}

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
    navigationOptions: ({ navigation }) => {
      const item = navigation.getParam('item');
      const isRecord = navigation.getParam('isRecord');
      const da = navigation.getParam('da');
      var buttonTop;

      isRecord ?
      buttonTop = <MenuButton
          name="save"
          onPress={() => {
            gravar(da, navigation);
          }}
        /> :
        buttonTop = <MenuButton
          name="trash-o"
          onPress={() => {
            remover(item, navigation);
          }}
        />

      return {
        title: 'Detalhes da NFCe',
        headerRight:
          buttonTop
      }
    },
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


