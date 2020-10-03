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
                  <ItemText>{ item.itemName }</ItemText>
                  <ItemText>(Código: { item.itemCode })</ItemText>
                </ContainerItems>
                <ContainerItems>
                  <ItemText>Qtde ítens: { item.qtdItem }</ItemText>
                  <ItemText>UN: { item.unItem }</ItemText>
                  <ItemText>Valor total R$: { item.itemValue }</ItemText>
                </ContainerItems>
              </Items>
            ))}
          </ItemScroll>
        </ItemBody>

        <ItemFooter>
          <ContainerItems>
            <ItemText>Qtde total de ítens: { item.totalItems }</ItemText>
            <ItemText>Valor total: R$ { item.totalValue }</ItemText>
          </ContainerItems>
        </ItemFooter>
      </Container>
    );
  }
}