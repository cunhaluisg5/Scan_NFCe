import React, { Component } from 'react';
import {
  View, FlatList, TouchableHighlight, StyleSheet,
  Dimensions, Image, AsyncStorage, Alert
} from 'react-native';

import Api from '../../services/Api';
import {
  Container, TextTitle, Subtitle, Category,
  TextInfo, Loading, Indicator
} from './Style';
import { AppColors } from '../../colors/AppColors';
import NfceImage from '../../../assets/nfce.png';

const moment = require('moment');
moment.locale('pt-BR');

var { width, height } = Dimensions.get('window');
var SCREEN_WIDTH = width < height ? width : height;
var recipeNumColums = 2;
var RECIPE_ITEM_HEIGHT = 150;
var RECIPE_ITEM_MARGIN = 20;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nfces: [],
      isLoading: false,
      errorMessage: null
    }
  }

  async componentDidMount() {
    this.getNfces();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.nfces !== this.state.nfces) {
      this.getNfces();
    }
  }

  getNfces = async () => {
    try {
      const { _id } = JSON.parse(await AsyncStorage.getItem('@APP:user'));
      const response = await Api.get('/nfces/user/' + _id);

      const { nfces } = response.data;

      this.setState({ nfces });
    } catch (response) {
      this.setState({ errorMessage: response.data.error })
      Alert.alert('Atenção!', this.state.errorMessage)
    }
  }

  onPressNfce = item => {
    this.setState({ isLoading: true })
    this.props.navigation.navigate('DetailsNfceScreen', { item: item, isRecord: false });
    this.setState({ isLoading: false })
  };

  renderNfce = ({ item }) => (
    <TouchableHighlight underlayColor='transparent' onPress={() => this.onPressNfce(item)}>
      <View style={styles.container}>
        <TextTitle color={AppColors.text}>{this.dateFormat(item.createdAt)}</TextTitle>
        <Subtitle color={AppColors.textBold}>{item.socialName.toUpperCase()}</Subtitle>
        <Image style={styles.image} source={NfceImage} />
        <Category fontSize={12} color={AppColors.text}>{item.issuanceDate}</Category>
        <Category fontSize={14} color={AppColors.text}>Qtde. Itens: {item.totalItems}</Category>
        <Category fontSize={14} color={AppColors.text}>Total: R$ {item.totalValue}</Category>
      </View>
    </TouchableHighlight>
  );

  dateFormat = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  render() {
    if (this.state.isLoading) {
      return (
        <Indicator background={AppColors.background}>
          <Loading size="large" color={AppColors.indicator} />
        </Indicator>
      )
    }

    return (
      <Container background={AppColors.background}>
        { this.state.nfces.length > 0 ?
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={this.state.nfces.reverse()}
            renderItem={this.renderNfce}
            keyExtractor={item => `${item._id}`}
          />
          : <TextInfo color={AppColors.text}></TextInfo>
        }
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: RECIPE_ITEM_MARGIN,
    marginTop: 20,
    width: (SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums,
    height: RECIPE_ITEM_HEIGHT + 75,
    borderColor: AppColors.invoice,
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: AppColors.backgroundWindow
  },
  image: {
    width: ((SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums) / 2,
    height: RECIPE_ITEM_HEIGHT / 2,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  }
})