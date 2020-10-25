import React, { Component } from 'react';

import {
  Container, ItemHeader, ItemBody, ItemFooter, ItemTitle, ItemSubtitle,
  ItemScroll, Items, ContainerItems, ItemText
} from './Style';
import { AppColors } from '../../colors/AppColors';

export default class DetailsNfceScreen extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item');
    const { items } = item;

    return (
      <Container backgroundColor={ AppColors.background }>
        <ItemHeader backgroundColor={ AppColors.backgroundWindow }>
          <ItemTitle color={ AppColors.textBold }>
            { item.socialName.toUpperCase() }
          </ItemTitle>
          <ItemSubtitle color={ AppColors.text }>
            CNPJ: { item.cnpj }, UF: { item.uf }
          </ItemSubtitle>
          <ItemSubtitle color={ AppColors.text }>
            Inscrição Estadual: { item.stateRegistration }
          </ItemSubtitle>
          <ItemSubtitle color={ AppColors.text }>
            Data Emissão : { item.issuanceDate }
          </ItemSubtitle>
        </ItemHeader>

        <ItemBody borderTopColor={ AppColors.borderTop } borderBottomColor={ AppColors.borderBottom2 }>
          <ItemScroll >
            {items.map(item => (
              <Items key={ item._id } backgroundColor={ AppColors.backgroundWindow } 
                borderRightColor={ AppColors.borderRight } borderBottomColor={ AppColors.borderBottom2 }
                borderLeftColor={ AppColors.borderLeft2 } borderTopColor={ AppColors.borderTop } >
                <ContainerItems >
                  <ItemText fontSize={ 12 } color={ AppColors.text }>{ item.itemName }</ItemText>
                  <ItemText fontSize={ 12 } color={ AppColors.text }>(Código: { item.itemCode })</ItemText>
                </ContainerItems>
                <ContainerItems>
                  <ItemText fontSize={ 12 } color={ AppColors.text }>Qtde ítens: { item.qtdItem }</ItemText>
                  <ItemText fontSize={ 12 } color={ AppColors.text }>UN: { item.unItem }</ItemText>
                  <ItemText fontSize={ 12 } color={ AppColors.text }>Valor total R$ { item.itemValue }</ItemText>
                </ContainerItems>
              </Items>
            ))}
          </ItemScroll>
        </ItemBody>

        <ItemFooter backgroundColor={ AppColors.backgroundWindow }>
          <ContainerItems >
            <ItemText fontSize={ 14 } color={ AppColors.text }>Base cálculo: R$ { item.icmsCalculationBasis }</ItemText>
            <ItemText fontSize={ 14 } color={ AppColors.text }>Valor ICMS: R$ { item.icmsValue }</ItemText>
          </ContainerItems>
          <ContainerItems >
            <ItemText fontSize={ 16 } color={ AppColors.textBold }>Qtde total de ítens: { item.totalItems }</ItemText>
            <ItemText fontSize={ 16 } color={ AppColors.textBold }>Valor total: R$ { item.totalValue }</ItemText>
          </ContainerItems>
        </ItemFooter>
      </Container>
    );
  }
}