import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import { Alert, AsyncStorage } from 'react-native';
import Header from '../components/Header/Header';
import HomeScreen from '../screens/Home/HomeScreen';
import DetailsNfceScreen from '../screens/DetailsNfce/DetailsNfceScreen';

import MenuButton from '../components/MenuButton/MenuButton';
import Api from '../services/Api';
import { AppColors } from '../colors/AppColors';

const gravar = async (nfce, navigation) => {
  try {
    const response = await Api.post('/nfces', nfce).then(() => {
      console.log('Salvo com sucesso!')
    })

    navigation.navigate('HomeScreen');
  } catch (err) {
      Alert.alert('Atenção!', response.data.error);
  }
}

const isRemove = (nfce, navigation) => {
  Alert.alert('Atenção', 'Deseja realmente excluir a nota?',
    [
      { text: 'Sim', onPress: () => remover(nfce, navigation) },
      { text: 'Não', onPress: () => console.log('Cancelado'), },
    ]
  );
}

const remover = async (nfce, navigation) => {
  try {
    const response = await Api.delete('/nfces/' + nfce._id);

    navigation.navigate('HomeScreen');
    console.log('Excluído com sucesso!');
  } catch (err) {
      setErrorMessage(response.data.error);
      Alert.alert('Atenção!', errorMessage);
  }
}

const returnOption = async () => {
  try {
    const optionSave = JSON.parse(await AsyncStorage.getItem('@APP:optionSave'));
    return optionSave
  } catch (err) {
      Alert.alert('Atenção!', err);
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
      const responseItems = navigation.getParam('responseItems');
      var buttonTop;

      (returnOption().then(option => {return option}) && isRecord) ?
        buttonTop = <MenuButton
          name="save"
          onPress={() => {
            gravar(responseItems, navigation);
          }}
        /> :
        buttonTop = <MenuButton
          name="trash-o"
          onPress={() => {
            isRemove(item, navigation);
          }}
        />

      return {
        title: 'Detalhes da Nota',
        headerRight: () =>
          buttonTop
      }
    },
  },
};

const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: AppColors.header,
    headerStyle: { backgroundColor: AppColors.backgroundHeader, height: 60 }
  }
});

export default HomeStack;


