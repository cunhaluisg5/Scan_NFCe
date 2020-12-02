import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import Api from '../../services/Api';
import {
    Container, ItemHeader, ItemBody, ItemTitle, ItemFooter, Views, Loading, Indicator,
    ItemScroll, Items, ContainerItems, ItemText, ContainerDetails, ItemBodyDetails, ItemsDetails
} from './Style';
import { AppColors } from '../../colors/AppColors';
const moment = require('moment');
moment.locale('pt-BR');

export default Comparison = () => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [nameItems, setNameItems] = useState([]);
    const [list, setList] = useState([]);
    const [listMonth, setListMonth] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            await getNfces();
        })();
    }, [list]);

    const getNfces = async () => {

        try {
            const { _id } = JSON.parse(await AsyncStorage.getItem('@APP:user'));
            const response = await Api.get('/nfces/user/' + _id);

            const { nfces } = response.data;

            setList(nfces);
        } catch (response) {
            console.log('Atenção!', response)
        }
    }

    const filterByMonth = (value) => {
        setIsLoading(true);
        const nfcesByMonth = list.filter(nfce => moment(nfce.issuanceDate, 'DD/MM/YYYY')
            .format('M') === value)

        setListMonth(nfcesByMonth);
        listNameItems(nfcesByMonth);
        setIsLoading(false);
    }

    const listNameItems = (listMonth) => {
        const returnNames = [];
        listMonth.map(nfce => {
            const { items } = nfce;
            const names = items.map(nfce => {
                return nfce.itemName
            })
            const uniqueNames = [...new Set(names)]
            uniqueNames.sort().map(item => {
                returnNames.push({ label: item, value: item })
            })
        });
        setNameItems(returnNames);
    }

    const placeholderMonths = {
        label: 'Selecione um mês...',
        color: '#9EA0A4',
    };

    const placeholderItems = {
        label: 'Selecione um item...',
        color: '#9EA0A4',
    };

    const dateFormat = (date) => {
        return moment(date).format('DD/MM/YYYY HH:MM:SS');
    };

    if (isLoading) {
        return (
          <Indicator background={AppColors.background}>
            <Loading size="large" color={AppColors.indicator} />
          </Indicator>
        )
      }

    return (
        <ItemScroll backgroundColor={AppColors.background}>
            <Views backgroundColor={AppColors.background}>
                <RNPickerSelect
                    placeholder={placeholderMonths}
                    onValueChange={(value) => filterByMonth(value)}
                    items={[
                        { label: 'JANEIRO', value: '1' },
                        { label: 'FEVEREIRO', value: '2' },
                        { label: 'MARÇO', value: '3' },
                        { label: 'ABRIL', value: '4' },
                        { label: 'MAIO', value: '5' },
                        { label: 'JUNHO', value: '6' },
                        { label: 'JULHO', value: '7' },
                        { label: 'AGOSTO', value: '8' },
                        { label: 'SETEMBRO', value: '9' },
                        { label: 'OUTUBRO', value: '10' },
                        { label: 'NOVEMBRO', value: '11' },
                        { label: 'DEZEMBRO', value: '12' },
                    ]}
                    style={{
                        inputAndroid: {
                            color: AppColors.text,
                            backgroundColor: AppColors.backgroundWindow,
                        }
                    }}
                />

                {listMonth.length > 0 &&
                    <ContainerDetails backgroundColor={AppColors.background} borderLeftColor={AppColors.borderTop} borderTopColor={AppColors.borderTop}
                        borderRightColor={AppColors.borderTop} borderBottomColor={AppColors.borderBottom}>
                        <ItemHeader backgroundColor={AppColors.backgroundWindow} >
                            <ItemTitle color={AppColors.textBold}>DETALHES DO MÊS</ItemTitle>
                        </ItemHeader>

                        <ItemBodyDetails backgroundColor={AppColors.backgroundWindow}>
                            <ItemsDetails backgroundColor={AppColors.backgroundWindow}
                                borderRightColor={AppColors.borderRight} borderBottomColor={AppColors.borderBottom2}
                                borderLeftColor={AppColors.borderLeft2} borderTopColor={AppColors.borderTop} >

                                <ItemText fontSize={12} color={AppColors.text}>Total de notas: {listMonth.length}</ItemText>

                                <ItemText fontSize={12} color={AppColors.text}>Total de itens: {listMonth.reduce((total, number) => {
                                    return total + parseFloat(number.items.length, 10);
                                }, 0)}
                                </ItemText>

                                <ItemText fontSize={12} color={AppColors.text}>Valor total de compra: R$ {listMonth.reduce((total, number) => {
                                    return total + parseFloat(number.totalValue, 10);
                                }, 0).toFixed(2)}
                                </ItemText>

                                <ItemText fontSize={12} color={AppColors.text}>Valor total de ICMS: R$ {listMonth.reduce((total, number) => {
                                    return total + parseFloat(number.icmsValue, 10);
                                }, 0).toFixed(2)}
                                </ItemText>
                            </ItemsDetails>
                        </ItemBodyDetails>
                    </ContainerDetails>
                }

                <RNPickerSelect
                    placeholder={placeholderItems}
                    onValueChange={(value) => setSelectedValue(value)}
                    items={nameItems}
                    style={{
                        inputAndroid: {
                            color: AppColors.text,
                            backgroundColor: AppColors.backgroundWindow,
                            marginTop: 10
                        }
                    }}
                />

                {listMonth.map((value, index) => {
                    const items = value.items.filter(item => item.itemName === selectedValue);
                    if (items.length > 0) {

                        return (
                            <Container key={index} backgroundColor={AppColors.background} borderLeftColor={AppColors.borderTop} borderTopColor={AppColors.borderTop}
                                borderRightColor={AppColors.borderTop} borderBottomColor={AppColors.borderTop}>
                                <ItemHeader backgroundColor={AppColors.backgroundWindow} >
                                    <ItemTitle color={AppColors.textBold}>
                                        {value.socialName.toUpperCase()}
                                    </ItemTitle>
                                </ItemHeader>
                                <ItemBody backgroundColor={AppColors.backgroundWindow}>
                                    {items.map(item => {
                                        return (
                                            <Items key={item._id} backgroundColor={AppColors.backgroundWindow}
                                                borderRightColor={AppColors.borderRight} borderBottomColor={AppColors.borderBottom2}
                                                borderLeftColor={AppColors.borderLeft2} borderTopColor={AppColors.borderTop} >
                                                <ContainerItems justifyContent={'space-between'}>
                                                    <ItemText fontSize={12} color={AppColors.text}>{item.itemName}</ItemText>
                                                    <ItemText fontSize={12} color={AppColors.text}>(Código: {item.itemCode})</ItemText>
                                                </ContainerItems>
                                                <ContainerItems justifyContent={'space-between'}>
                                                    <ItemText fontSize={12} color={AppColors.text}>Valor: R$ {item.itemValue}</ItemText>
                                                </ContainerItems>
                                            </Items>
                                        )
                                    })}
                                </ItemBody>
                                <ItemFooter backgroundColor={AppColors.backgroundWindow} >
                                    <ContainerItems justifyContent={'flex-start'}>
                                        <ItemText fontSize={12} color={AppColors.text}>Data de compra: {value.issuanceDate}</ItemText>
                                    </ContainerItems>
                                    <ContainerItems justifyContent={'flex-start'}>
                                        <ItemText fontSize={12} color={AppColors.text}>Data de leitura: {dateFormat(value.createdAt)}</ItemText>
                                    </ContainerItems>
                                </ItemFooter>
                            </Container>
                        )
                    }
                })}
            </Views>
        </ItemScroll>
    );
}