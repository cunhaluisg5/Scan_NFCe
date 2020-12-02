import React, { Component } from 'react';
import { Dimensions, AsyncStorage, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import RadioForm from 'react-native-simple-radio-button';

const moment = require('moment');
moment.locale('pt-BR');

import Api from '../../services/Api';
import {
    Loading, Indicator, Container, TextHeader, ChartLine, Scroll, ContainerRadio, Description,
    ContainerText, DetailsNfce, ContainerNfce, ItemHeader, ItemTitle, ItemSubtitle, ContainerDays
} from './Style';
import { AppColors } from '../../colors/AppColors';

export default class LineChartExample extends Component {
    constructor(props) {
        super(props);
        dayNow = moment().format('DD');
        monthNow = moment().format('MM');
        yearNow = moment().format('YYYY');
        radio_props = [
            { label: 'Dia', value: 0 },
            { label: 'Mês', value: 1 },
            { label: 'Ano', value: 2 }
        ];
        this.state = {
            isLoading: false,
            nfces: [],
            value: 1,
            errorMessage: ''
        }
    }

    async componentDidMount() {
        await this.getNfces();
    }

    filterByDay = () => {
        const { nfces } = this.state;
        var value = 0;

        nfces.forEach(nfce => {
            if (dayNow === moment(nfce.issuanceDate, 'DD/MM/YYYY').format('DD'))
                value += parseFloat(nfce.totalValue, 10);
        });

        return { name: [dayNow + ' ' + this.returnMonthName(parseInt(monthNow)).short], values: [value] };
    }

    filterByMonth = () => {
        const { nfces } = this.state;
        var value = 0;

        nfces.forEach(nfce => {
            if (monthNow === moment(nfce.issuanceDate, 'DD/MM/YYYY').format('MM'))
                value += parseFloat(nfce.totalValue, 10);
        });

        return { name: [this.returnMonthName(parseInt(monthNow)).short], values: [value] };
    }

    filterByYear = () => {
        const { nfces } = this.state;
        var returnList = {
            name: [],
            values: []
        }

        for (var i = 0; i < 12; i++) {
            returnList.name[i] = this.returnMonthName(i + 1).short;
            returnList.values[i] = 0;
        }

        nfces.forEach(nfce => {
            if (yearNow === moment(nfce.issuanceDate, 'DD/MM/YYYY').format('YYYY')) {
                const month = parseInt(moment(nfce.issuanceDate, 'DD/MM/YYYY').format('MM'));
                const value = returnList.values[month - 1] + parseFloat(nfce.totalValue, 10);
                returnList.values[month - 1] = value;
            }
        });

        return returnList;
    }

    filter = () => {
        const { value } = this.state;

        if (value === 0) {
            return this.filterByDay();
        }

        if (value === 1) {
            return this.filterByMonth();
        }

        if (value === 2) {
            return this.filterByYear();
        }
    }

    returnMonthName = (val) => {
        switch (val) {
            case 1: return {short: 'Jan', complete: 'Janeiro'};
            case 2: return {short: 'Fev', complete: 'Fevereiro'};
            case 3: return {short: 'Mar', complete: 'Março'};
            case 4: return {short: 'Abr', complete: 'Abril'};
            case 5: return {short: 'Mai', complete: 'Maio'};
            case 6: return {short: 'Jun', complete: 'Junho'};
            case 7: return {short: 'Jul', complete: 'Julho'};
            case 8: return {short: 'Ago', complete: 'Agosto'};
            case 9: return {short: 'Set', complete: 'Setembro'};
            case 10: return {short: 'Out', complete: 'Outubro'};
            case 11: return {short: 'Nov', complete: 'Novembro'};
            case 12: return {short: 'Dez', complete: 'Dezembro'};
        }
    }

    getNfces = async () => {
        this.setState({ isLoading: true });
        try {
            const { _id } = JSON.parse(await AsyncStorage.getItem('@APP:user'));
            const response = await Api.get('/nfces/user/' + _id);

            const { nfces } = response.data;

            this.setState({ nfces });
        } catch (response) {
            this.setState({ errorMessage: response.data.error })
            Alert.alert('Atenção!', this.state.errorMessage)
        }
        this.setState({ isLoading: false });
    }

    calculateMaxValue = () => {
        const { nfces, value } = this.state;
        var nfcesFilter = [];

        if (value === 0)
            nfcesFilter = nfces.filter(nfce => dayNow === moment(nfce.issuanceDate, 'DD/MM/YYYY').format('DD'));

        if (value === 1)
            nfcesFilter = nfces.filter(nfce => monthNow === moment(nfce.issuanceDate, 'DD/MM/YYYY').format('MM'));

        if (value === 2)
            nfcesFilter = nfces.filter(nfce => yearNow === moment(nfce.issuanceDate, 'DD/MM/YYYY').format('YYYY'));

        const maxValue = Math.max.apply(Math, nfcesFilter.map((nfce) => { return nfce.totalValue }))
        const maxNfce = nfcesFilter.filter((nfce) => { return parseFloat(nfce.totalValue, 10) === maxValue });
        return maxNfce;
    }

    mostExpensive = () => {
        const { value } = this.state;
        var filtered = [];

        if (value === 1) {
            filtered = this.mostExpensiveDays();
        }

        if (value === 2) {
            filtered = this.mostExpensiveMonths();
        }

        if (filtered.length > 0) {
            return (
                <ContainerNfce>
                    <DetailsNfce color={AppColors.text} background={AppColors.backgroundWindow}
                        borderTopColor={AppColors.borderTop} borderBottomColor={AppColors.borderBottom}>
                        Valores do período
                    </DetailsNfce>
                    <ContainerDays
                        background={AppColors.backgroundWindow} borderRightColor={AppColors.borderRight}
                        borderBottomColor={AppColors.borderBottom2} borderLeftColor={AppColors.borderLeft2}
                        borderTopColor={AppColors.borderTop}>
                        {filtered.map((item, key) => {
                            return <Description key={key}>
                                <ItemTitle color={AppColors.textBold}>{value === 1 ? 
                                    ('DIA ' + item.name) : 
                                    this.returnMonthName(item.name).complete.toUpperCase()} {value.name}
                                </ItemTitle>
                                <ItemSubtitle fontSize={14} color={AppColors.text}>
                                    Total de notas: {item.count}
                                </ItemSubtitle>
                                <ItemSubtitle fontSize={14} color={AppColors.text}>
                                    Valor total: R$ {item.value}
                                </ItemSubtitle>
                            </Description>
                        })}
                    </ContainerDays>
                </ContainerNfce>)
        }
    }

    mostExpensiveDays = () => {
        const { nfces } = this.state;
        const filteredByDay = [];

        const filteredByMonth = nfces.filter(nfce => monthNow === moment(nfce.issuanceDate, 'DD/MM/YYYY').format('MM'));
        for (var i = 1; i <= 31; i++) {
            const filter = filteredByMonth.filter(nfce =>
                i === parseInt(moment(nfce.issuanceDate, 'DD/MM/YYYY').format('D')));
            if (filter.length > 0) {
                const values = filter.reduce((total, number) => {
                    return total + parseFloat(number.totalValue, 10);
                }, 0).toFixed(2)
                filteredByDay.push({ name: i, value: values, count: filter.length })
            }
        }

        return filteredByDay;
    }

    mostExpensiveMonths = () => {
        const { nfces } = this.state;
        const filteredByMonth = [];

        const filteredByYear = nfces.filter(nfce => yearNow === moment(nfce.issuanceDate, 'DD/MM/YYYY').format('YYYY'));
        for (var i = 1; i <= 12; i++) {
            const filter = filteredByYear.filter(nfce =>
                i === parseInt(moment(nfce.issuanceDate, 'DD/MM/YYYY').format('M')));
            if (filter.length > 0) {
                const values = filter.reduce((total, number) => {
                    return total + parseFloat(number.totalValue, 10);
                }, 0).toFixed(2)
                filteredByMonth.push({ name: i, value: values, count: filter.length })
            }
        }

        return filteredByMonth;
    }

    onPressNfce = item => {
        this.props.navigation.navigate('DetailsNfceScreen', { item: item, isRecord: false });
    };

    renderRadio = () => {
        return (
            <ContainerRadio>
                <RadioForm
                    radio_props={radio_props}
                    initial={1}
                    buttonColor={AppColors.buttonRadio}
                    buttonSize={14}
                    buttonOuterColor={AppColors.buttonRadio}
                    selectedButtonColor={AppColors.buttonRadioSelected}
                    labelStyle={{ fontSize: 14, color: AppColors.textBold, marginRight: 10 }}
                    formHorizontal={true}
                    onPress={(value) => { this.setState({ value: value }) }}
                />
            </ContainerRadio>
        )
    }

    LineChart = () => {
        const { name, values } = this.filter();

        return (
            <>
                <ContainerText background={AppColors.backgroundWindow}
                    borderTopColor={AppColors.borderTop} borderBottomColor={AppColors.borderBottom}>
                    <TextHeader color={AppColors.text}>Gastos (R$/Período) {this.dateNow}</TextHeader>
                </ContainerText>
                <LineChart
                    data={{
                        labels: name,
                        datasets: [
                            {
                                data: values,
                                strokeWidth: 2,
                            },
                        ],
                    }}
                    key={name}
                    width={Dimensions.get('window').width - 16}
                    height={220}
                    chartConfig={{
                        backgroundColor: AppColors.backgroundChart,
                        backgroundGradientFrom: AppColors.backgroundWindow,
                        backgroundGradientTo: AppColors.backgroundWindow,
                        decimalPlaces: 2,
                        color: (opacity = 10) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                        borderStyle: "solid",
                        borderTopColor: AppColors.borderTop,
                        borderLeftColor: AppColors.borderLeft2,
                        borderRightColor: AppColors.borderRight,
                        borderBottomColor: AppColors.borderBottom2,
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 3,
                        borderBottomWidth: 3
                    }}
                />
            </>
        );
    };

    render() {
        if (this.state.isLoading) {
            return (
                <Indicator background={AppColors.background}>
                    <Loading size="large" color={AppColors.indicator} />
                </Indicator>
            )
        }

        const nfces = this.calculateMaxValue().map((nfce, index) => {
            return (
                <ContainerNfce key={index}>
                    <DetailsNfce color={AppColors.text} background={AppColors.backgroundWindow}
                        borderTopColor={AppColors.borderTop} borderBottomColor={AppColors.borderBottom}>
                        Nota mais cara no período
                    </DetailsNfce>
                    <ItemHeader onPress={() => this.onPressNfce(nfce)} key={index}
                        background={AppColors.backgroundWindow} borderRightColor={AppColors.borderRight}
                        borderBottomColor={AppColors.borderBottom2} borderLeftColor={AppColors.borderLeft2}
                        borderTopColor={AppColors.borderTop}>
                        <ItemTitle color={AppColors.textBold}>{nfce.socialName.toUpperCase()}</ItemTitle>
                        <ItemSubtitle fontSize={14} color={AppColors.text}>
                            CNPJ: {nfce.cnpj}, UF: {nfce.uf}
                        </ItemSubtitle>
                        <ItemSubtitle fontSize={14} color={AppColors.text}>
                            Data Emissão : {nfce.issuanceDate}
                        </ItemSubtitle>
                        <ItemSubtitle fontSize={18} color={AppColors.textBold}>
                            Valor Total: R$ {nfce.totalValue}
                        </ItemSubtitle>
                    </ItemHeader>
                </ContainerNfce>
            );
        });

        return (
            <Container background={AppColors.background}>
                <Scroll>
                    {this.renderRadio()}
                    <ChartLine background={AppColors.background}>
                        {this.LineChart()}
                    </ChartLine>
                    {nfces}
                    {this.mostExpensive()}
                </Scroll>
            </Container>
        )
    }
}