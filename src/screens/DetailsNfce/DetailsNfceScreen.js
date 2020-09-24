import React, { Component } from 'react';
import { Alert } from 'react-native';
import BackButton from '../../components/BackButton/BackButton';
import MenuButton from '../../components/MenuButton/MenuButton';

import Api from '../../services/Api';

import {
  Container,
  ItemHeader,
  ItemBody,
  ItemFooter,
  ItemTitle,
  ItemSubtitle,
  ItemScroll,
  Items,
  ContainerItems,
  ItemText
} from './Style';

export default class DetailsNfceScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTransparent: 'true',
      headerLeft: (
        <BackButton
          name="home"
          onPress={() => {
            navigation.goBack();
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
  }

  gravar = async (nfce) => {
    try {
      const response = await Api.post('/nfces', nfce);

      //const { nfce } = response.data;

      Alert.alert('Atenção', 'Salvo com sucesso!');
    } catch (err) {
      console.log('Erro ao salvar ', err)
    }
  }

  remover = async (nfce) => {
    try {
      const response = await Api.delete('/nfces', nfce._id);

      //const { nfce } = response.data;

      Alert.alert('Atenção', 'Excluído com sucesso!');
    } catch (err) {
      console.log('Erro ao excluir ', err)
    }
  }

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item');
    const isRecord = navigation.getParam('isRecord');
    const da = navigation.getParam('da');
    const { items } = item;

    return (
      <Container>
        {isRecord ?
          <MenuButton
            title="SALVAR"
            name="save"
            onPress={() => {
              this.gravar(da);
              navigation.navigate('Home');
            }}
          /> :
          <MenuButton
            title="EXCLUIR"
            name="trash-o"
            onPress={() => {
              this.remover(item);
              navigation.navigate('Home');
            }}
          />
        }

        <ItemHeader>
          <ItemTitle>{item.socialName}</ItemTitle>
          <ItemSubtitle>CNPJ: {item.cnpj}, UF: {item.uf}</ItemSubtitle>
          <ItemSubtitle>Inscrição Estadual: {item.stateRegistration}</ItemSubtitle>
          <ItemSubtitle>Data Emissão : {item.issuanceDate}</ItemSubtitle>
        </ItemHeader>

        <ItemBody>
          <ItemScroll>
            {items.map(item => (
              <Items key={item._id}>
                <ContainerItems>
                  <ItemText>{item.itemName}</ItemText>
                  <ItemText>(Código: {item.itemCode})</ItemText>
                </ContainerItems>
                <ContainerItems>
                  <ItemText>Qtde ítens: {item.qtdItem}</ItemText>
                  <ItemText>UN: {item.unItem}</ItemText>
                  <ItemText>Valor total R$: {item.itemValue}</ItemText>
                </ContainerItems>
              </Items>
            ))}
          </ItemScroll>
        </ItemBody>

        <ItemFooter>
          <ContainerItems>
            <ItemText>Qtde total de ítens: {item.totalItems}</ItemText>
            <ItemText>Valor total: R$ {item.totalValue}</ItemText>
          </ContainerItems>
        </ItemFooter>
      </Container>
    );
  }
}