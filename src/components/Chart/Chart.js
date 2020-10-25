import React, { Component } from 'react';
import { Dimensions, AsyncStorage } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const moment = require('moment');
moment.locale('pt-BR');

import Api from '../../services/Api';
import {
    Loading, Indicator, Container, TextHeader, ChartLine, Scroll,
    ContainerText, DetailsNfce, ContainerNfce, ItemHeader, ItemTitle, ItemSubtitle
} from './Style';
import { AppColors } from '../../colors/AppColors';

export default class LineChartExample extends Component {
    constructor(props) {
        super(props);
        this.dateNow = moment().format('YYYY');
        this.state = {
            isLoading: false,
            nfces: [],
            months: [
                {
                    month: 'Jan',
                    value: 0
                },
                {
                    month: 'Fev',
                    value: 0
                },
                {
                    month: 'Mar',
                    value: 0
                },
                {
                    month: 'Abr',
                    value: 0
                },
                {
                    month: 'Mai',
                    value: 0
                },
                {
                    month: 'Jun',
                    value: 0
                },
                {
                    month: 'Jul',
                    value: 0
                },
                {
                    month: 'Ago',
                    value: 0
                },
                {
                    month: 'Set',
                    value: 0
                },
                {
                    month: 'Out',
                    value: 0
                },
                {
                    month: 'Nov',
                    value: 0
                },
                {
                    month: 'Dez',
                    value: 0
                }
            ]
        }
    }

    async componentDidMount() {
        await this.getNfces();
        this.calculateDate();
    }

    getNfces = async () => {
        this.setState({ isLoading: true });
        try {
            const { _id } = JSON.parse(await AsyncStorage.getItem('@APP:user'));
            const response = await Api.get('/nfces/user/' + _id);

            const { nfces } = response.data;

            this.setState({ nfces });
        } catch (response) {
            //this.setState({ errorMessage: response.data.error });
        }
        this.setState({ isLoading: false });
    }

    calculateDate = () => {
        const { nfces } = this.state;

        const res = nfces.map((nfce) => {
            const NfceYear = moment(nfce.issuanceDate, 'DD/MM/YYYY').format('YYYY');
            const NfceMonth = moment(nfce.issuanceDate, 'DD/MM/YYYY').format('M');
            if (NfceYear === this.dateNow) {
                this.incrementValue(NfceMonth, parseFloat(nfce.totalValue, 10));
            }
        })
    }

    incrementValue = (monthNfce, value) => {
        const { months } = this.state;
        months[monthNfce - 1].value += value;
        this.setState({ months })
    }

    calculateMaxValue = () => {
        const { nfces } = this.state;
        const maxValue = Math.max.apply(Math, nfces.map((nfce) => { return nfce.totalValue }))
        const maxNfce = nfces.filter((nfce) => { return parseFloat(nfce.totalValue, 10) === maxValue });
        return maxNfce;
    }

    onPressNfce = item => {
        this.props.navigation.navigate('DetailsNfceScreen', { item: item, isRecord: false });
    };

    LineChart = () => {
        const months = this.state.months.map((month) => { return month.month });
        const data = this.state.months.map((month) => { return month.value });

        return (
            <>
                <ContainerText background={ AppColors.backgroundWindow } 
                    borderTopColor={ AppColors.borderTop } borderBottomColor={ AppColors.borderBottom }>
                    <TextHeader color={ AppColors.text }>Gastos (R$/Mês) {this.dateNow}</TextHeader>
                </ContainerText>
                <LineChart
                    data={{
                        labels: months,
                        datasets: [
                            {
                                data: data,
                                strokeWidth: 2,
                            },
                        ],
                    }}
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
                <Indicator background={ AppColors.background }>
                    <Loading size="large" color={ AppColors.indicator } />
                </Indicator>
            )
        }

        const nfces = this.calculateMaxValue().map((nfce, index) => {
            return (
                <ContainerNfce>
                    <DetailsNfce color={ AppColors.text } background={ AppColors.backgroundWindow } 
                    borderTopColor={ AppColors.borderTop } borderBottomColor={ AppColors.borderBottom }>
                        Nota mais cara no período
                    </DetailsNfce>
                    <ItemHeader onPress={() => this.onPressNfce(nfce)} key={index} 
                        background={ AppColors.backgroundWindow } borderRightColor={ AppColors.borderRight } 
                        borderBottomColor={ AppColors.borderBottom2 } borderLeftColor={ AppColors.borderLeft2 } 
                        borderTopColor={ AppColors.borderTop }>
                        <ItemTitle color={ AppColors.textBold }>{nfce.socialName.toUpperCase()}</ItemTitle>
                        <ItemSubtitle fontSize={ 14 } color={ AppColors.text }>
                            CNPJ: {nfce.cnpj}, UF: {nfce.uf}
                        </ItemSubtitle>
                        <ItemSubtitle fontSize={ 14 } color={ AppColors.text }>
                            Data Emissão : {nfce.issuanceDate}
                        </ItemSubtitle>
                        <ItemSubtitle fontSize={ 18 } color={ AppColors.textBold }>
                            Valor Total: R$ {nfce.totalValue}
                        </ItemSubtitle>
                    </ItemHeader>
                </ContainerNfce>
            );
        });

        return (
            <Container background={ AppColors.background }>
                <Scroll>
                    <ChartLine background={ AppColors.background }>
                        {this.LineChart()}
                    </ChartLine>
                    {nfces}
                </Scroll>
            </Container>
        )
    }
}