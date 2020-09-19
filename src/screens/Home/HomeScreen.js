import React, { Component } from 'react';
import { View, FlatList, TouchableHighlight, Text, StyleSheet, Dimensions, Image, AsyncStorage } from 'react-native';

import MenuIcon from '../../components/MenuIcon/MenuIcon';
import Api from '../../services/Api';
import { Container, TextTitle, Subtitle, Category } from './Style';
const moment = require('moment');
moment.locale('pt-BR');

// screen sizing
var { width, height } = Dimensions.get('window');
// orientation must fixed
var SCREEN_WIDTH = width < height ? width : height;

var recipeNumColums = 2;
// item size
var RECIPE_ITEM_HEIGHT = 150;
var RECIPE_ITEM_MARGIN = 20;

export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Início',
    headerLeft: () => (
      <MenuIcon
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      nfces: []
    }
  }

  async componentDidMount() {
    this.getNfces();
  }

  getNfces = async () => {
    try {
      const { _id } = JSON.parse(await AsyncStorage.getItem('@APP:user'));
      const response = await Api.get('/nfces/user/' + _id);

      const { nfces } = response.data;

      this.setState({ nfces });
    } catch (response) {
      this.setState({ errorMessage: response.data.error });
    }
  }

  onPressNfce = item => {
    this.props.navigation.navigate('Detalhes da NFCe', { item });
  };

  renderNfce = ({ item }) => (
    <TouchableHighlight underlayColor='transparent' onPress={() => this.onPressNfce(item)}>
      <View style={styles.container}>
        <TextTitle>{this.dateFormat(item.createdAt)}</TextTitle>
        <Subtitle>{item.socialName}</Subtitle>
        <Image style={styles.image} source={require('../../../assets/nfce.png')} />
        <Category>Qtde. Itens: {item.totalItems}</Category>
        <Category>Valor Total: R$ {item.totalValue}</Category>
      </View>
    </TouchableHighlight>
  );

  dateFormat = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  render() {
    return (
      <Container>
        {this.state.nfce !== null ?
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={this.state.nfces}
            renderItem={this.renderNfce}
            keyExtractor={item => `${item._id}`}
          />
          : <Text>Não existem notas fiscais</Text>
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
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 15,
    backgroundColor: '#142541'
  },
  image: {
    width: ((SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums) / 2,
    height: RECIPE_ITEM_HEIGHT / 2,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  }
})