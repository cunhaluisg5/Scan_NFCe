import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, AsyncStorage } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import Api from '../../services/Api';
import {
    Container, ItemHeader, ItemBody, ItemTitle, ItemFooter,
    ItemScroll, Items, ContainerItems, ItemText
} from './Style';
import { AppColors } from '../../colors/AppColors';
const moment = require('moment');
moment.locale('pt-BR');

export default Comparison = () => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [nameItems, setNameItems] = useState([]);
    const [list, setList] = useState([]);
    const [listMonth, setListMonth] = useState([]);

    useEffect(() => {
        (async () => {
            await getNfces();
        })();
    }, []);

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
        const nfcesByMonth = list.filter(nfce => moment(nfce.issuanceDate, 'DD/MM/YYYY')
            .format('M') === value)

        setListMonth(nfcesByMonth);
        listNameItems(nfcesByMonth);
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

    return (
        <View style={styles.container}>
            <RNPickerSelect
                placeholder={placeholderMonths}
                onValueChange={(value) => filterByMonth(value)}
                items={[
                    { label: 'Janeiro', value: '1' },
                    { label: 'Fevereiro', value: '2' },
                    { label: 'Março', value: '3' },
                    { label: 'Abril', value: '4' },
                    { label: 'Maio', value: '5' },
                    { label: 'Junho', value: '6' },
                    { label: 'Julho', value: '7' },
                    { label: 'Agosto', value: '8' },
                    { label: 'Setembro', value: '9' },
                    { label: 'Outubro', value: '10' },
                    { label: 'Novembro', value: '11' },
                    { label: 'Dezembro', value: '12' },
                ]}
            />

            { listMonth.length > 0 &&
                <View>
                    <Text>Total de notas: {listMonth.length}</Text>

                    <Text>Valor total de itens: {listMonth.reduce(function (total, numero) {
                        return total + parseFloat(numero.items.length, 10);
                    }, 0)}
                    </Text>

                    <Text>Valor total de compra: {listMonth.reduce(function (total, numero) {
                        return total + parseFloat(numero.totalValue, 10);
                    }, 0)}
                    </Text>

                    <Text>Valor total ICMS: {listMonth.reduce(function (total, numero) {
                        return total + parseFloat(numero.icmsValue, 10);
                    }, 0)}
                    </Text>
                </View>
            }

            <RNPickerSelect
                placeholder={placeholderItems}
                onValueChange={(value) => setSelectedValue(value)}
                items={nameItems}
            />

            { listMonth.map(value => {
                const items = value.items.filter(item => item.itemName === selectedValue);
                if (items.length > 0) {
                    const total = items.reduce(function (total, numero) {
                        return total + numero.itemValue;
                    }, 0);

                    return (
                        <ItemScroll backgroundColor={AppColors.background}>
                            <Container backgroundColor={AppColors.background} borderLeftColor={AppColors.borderTop} borderTopColor={AppColors.borderTop}
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
                                                <ContainerItems >
                                                    <ItemText fontSize={12} color={AppColors.text}>{item.itemName}</ItemText>
                                                    <ItemText fontSize={12} color={AppColors.text}>(Código: {item.itemCode})</ItemText>
                                                    <ItemText fontSize={12} color={AppColors.text}>Valor total R$ {item.itemValue}</ItemText>
                                                </ContainerItems>
                                            </Items>
                                        )
                                    })}
                                </ItemBody>
                                <ItemFooter backgroundColor={AppColors.backgroundWindow} >
                                    <ContainerItems >
                                        <ItemText fontSize={12} color={AppColors.text}>Total R$ {total}</ItemText>
                                        <ItemText fontSize={12} color={AppColors.text}>Data de compra: {value.issuanceDate}</ItemText>
                                        <ItemText fontSize={12} color={AppColors.text}>Data de leitura: {value.createdAt}</ItemText>
                                    </ContainerItems>
                                </ItemFooter>
                            </Container>
                        </ItemScroll>
                    )
                }
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        alignItems: "center"
    }
});