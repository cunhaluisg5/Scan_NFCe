import React, { Component } from 'react';

import {
  Container, ItemHeader, ItemBody, ItemFooter, ItemTitle, ItemSubtitle,
  ItemScroll, Items, ContainerItems, ItemText
} from './Style';

export default class DetailsNfceScreen extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item');
    const { items } = item;

    return (
      <Container backgroundColor={'#0a0d1c'}>
        <ItemHeader alignItems={'center'} maxHeight={120} backgroundColor={'#142541'}>
          <ItemTitle fontSize={20} fontWeight={'bold'} marginTop={10} color={'#ff870f'}>
            { item.socialName.toUpperCase() }
          </ItemTitle>
          <ItemSubtitle fontSize={14} marginTop={5} color={'#fff'}>
            CNPJ: { item.cnpj }, UF: { item.uf }
          </ItemSubtitle>
          <ItemSubtitle fontSize={14} marginTop={5} color={'#fff'}>
            Inscrição Estadual: { item.stateRegistration }
          </ItemSubtitle>
          <ItemSubtitle fontSize={14} marginTop={5} color={'#fff'}>
            Data Emissão : { item.issuanceDate }
          </ItemSubtitle>
        </ItemHeader>

        <ItemBody alignItems={'flex-start'} padding={10} borderTopWidth={2} borderBottomWidth={2} 
          borderTopColor={'#7FFFD4'} borderBottomColor={'#FFD700'}>
          <ItemScroll width={100} padding={1}>
            {items.map(item => (
              <Items key={ item._id } marginBottom={15} padding={10} backgroundColor={'#142541'} 
                borderRadius={8} borderStyle={'solid'} borderRightColor={'#FFD700'} borderBottomColor={'#FFD700'}
                borderLeftColor={'#7FFFD4'} borderTopColor={'#7FFFD4'} borderTopWidth={1} borderLeftWidth={1}
                borderRightWidth={3} borderBottomWidth={3}>
                <ContainerItems flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <ItemText fontSize={12} color={'#fff'}>{ item.itemName }</ItemText>
                  <ItemText fontSize={12} color={'#fff'}>(Código: { item.itemCode })</ItemText>
                </ContainerItems>
                <ContainerItems flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <ItemText fontSize={12} color={'#fff'}>Qtde ítens: { item.qtdItem }</ItemText>
                  <ItemText fontSize={12} color={'#fff'}>UN: { item.unItem }</ItemText>
                  <ItemText fontSize={12} color={'#fff'}>Valor total R$ { item.itemValue }</ItemText>
                </ContainerItems>
              </Items>
            ))}
          </ItemScroll>
        </ItemBody>

        <ItemFooter justifyContent={'center'} fontWeight={'bold'} maxHeight={70} padding={10} 
          backgroundColor={'#142541'}>
          <ContainerItems flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <ItemText fontSize={14} color={'#fff'}>Base cálculo: R$ { item.icmsCalculationBasis }</ItemText>
            <ItemText fontSize={14} color={'#fff'}>Valor ICMS: R$ { item.icmsValue }</ItemText>
          </ContainerItems>
          <ContainerItems flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <ItemText fontSize={16} color={'#ff870f'}>Qtde total de ítens: { item.totalItems }</ItemText>
            <ItemText fontSize={16} color={'#ff870f'}>Valor total: R$ { item.totalValue }</ItemText>
          </ContainerItems>
        </ItemFooter>
      </Container>
    );
  }
}