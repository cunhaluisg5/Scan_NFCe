/*import React, { useState } from 'react';
import { AsyncStorage } from 'react-native';
import { Text } from 'react-native-svg';
import { PieChart } from 'react-native-svg-charts';

import Api from '../../services/Api';
import { Container } from './Style';

export default Chart = () => {
    const [data, setData] = useState([]);
    const pieData = data.map((value, index) => ({
        value,
        key: `${index}-${value}`,
        svg: {
            fill: (
                '#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000'
            ).slice(0, 7)
        }
    }));

    const getNfces = async () => {
        try {
            const datas = [];
            const { _id } = JSON.parse(await AsyncStorage.getItem('@APP:user'));
            const response = await Api.get('/nfces/user/' + _id);

            const { nfces } = response.data;

            nfces.map((value, index) => {
                datas.push(value.totalValue);
            });
            setData(datas);
        } catch (response) {
            this.setState({ errorMessage: response.data.error });
        }
    }

    const Label = ({ slices }) => {
        return slices.map((slice, index) => {
            const { pieCentroid, data } = slice;
            return (
                <Text
                    key={`label-${index}`}
                    x={ pieCentroid[0] }
                    y={ pieCentroid[1] }
                    fill='black'
                    textAnchor={ 'middle' }
                    alignmentBaseline={ 'middle' }
                    fontSize={ 22 }
                >
                    { data.value }
                </Text>
            )
        })
    }

    if (data.length === 0) {
        getNfces()
    }

    return (
        <Container>
            <PieChart style={{ height: 400, marginLeft: 10, marginRight: 10 }} data={ pieData }>
                <Label />
            </PieChart>
        </Container>
    )
}*/

import React from 'react'
import { View, TouchableHighlight } from 'react-native'
import { BarChart, Grid } from 'react-native-svg-charts'
import { Text } from 'react-native-svg'

class BarChartHorizontalWithLabels extends React.PureComponent {

    render() {

        const data = [50, 10, 40, 95, 85, 2, 8, 77, 4, 5, 2, 44, 8, 69]

        const CUT_OFF = 50
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <Text
                    key={index}
                    x={value > CUT_OFF ? x(0) + 10 : x(value) + 10}
                    y={y(index) + (bandwidth / 2)}
                    fontSize={14}
                    fill={value > CUT_OFF ? 'white' : 'white'}
                    alignmentBaseline={'middle'}
                >
                    {value}
                </Text>
            ))
        )

        return (
                <TouchableHighlight style={{
                    flexDirection: 'row', height: '100%', paddingVertical: 16,
                    backgroundColor: '#0a0d1c'
                }}>
                    <BarChart
                        style={{ flex: 1, marginLeft: 10, marginRight: 10,  }}
                        data={data}
                        horizontal={true}
                        svg={{ fill: 'rgba(255,135,15, 0.8)' }}
                        contentInset={{ top: 10, bottom: 10 }}
                        spacing={0.2}
                        gridMin={0}
                    >
                        <Grid direction={Grid.Direction.VERTICAL} />
                        <Labels />
                    </BarChart>
                </TouchableHighlight>
        )
    }

}

export default BarChartHorizontalWithLabels