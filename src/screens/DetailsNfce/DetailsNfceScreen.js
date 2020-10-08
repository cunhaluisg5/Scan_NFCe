import React, { Component } from 'react';

import {
  Container, ItemHeader, ItemBody, ItemFooter, ItemTitle, ItemSubtitle,
  ItemScroll, Items, ContainerItems, ItemText, Indicator, Loading
} from './Style';

export default class DetailsNfceScreen extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    isLoading: false
  };

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item');
    const { items } = item;

    if (this.state.isLoading) {
      return (
        <Indicator>
          <Loading size="large" color="#1CB5E0" />
        </Indicator>
      )
    }

    return (
      <Container>
        <ItemHeader>
          <ItemTitle>{ item.socialName }</ItemTitle>
          <ItemSubtitle>CNPJ: { item.cnpj }, UF: { item.uf }</ItemSubtitle>
          <ItemSubtitle>Inscrição Estadual: { item.stateRegistration }</ItemSubtitle>
          <ItemSubtitle>Data Emissão : { item.issuanceDate }</ItemSubtitle>
        </ItemHeader>

        <ItemBody>
          <ItemScroll>
            {items.map(item => (
              <Items key={ item._id }>
                <ContainerItems>
                  <ItemText fontSize='12'>{ item.itemName }</ItemText>
                  <ItemText fontSize='12'>(Código: { item.itemCode })</ItemText>
                </ContainerItems>
                <ContainerItems>
                  <ItemText fontSize='12'>Qtde ítens: { item.qtdItem }</ItemText>
                  <ItemText fontSize='12'>UN: { item.unItem }</ItemText>
                  <ItemText fontSize='12'>Valor total R$: { item.itemValue }</ItemText>
                </ContainerItems>
              </Items>
            ))}
          </ItemScroll>
        </ItemBody>

        <ItemFooter>
          <ContainerItems>
            <ItemText fontSize='14'>Qtde total de ítens: { item.totalItems }</ItemText>
            <ItemText fontSize='14'>Valor total: R$ { item.totalValue }</ItemText>
          </ContainerItems>
        </ItemFooter>
      </Container>
    );
  }
}