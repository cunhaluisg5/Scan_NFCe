import React, { useState } from 'react';
import { View, AsyncStorage } from 'react-native';
import { Text } from 'react-native-svg';
import { PieChart } from 'react-native-svg-charts';

import Api from '../../services/Api';

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
                    x={pieCentroid[0]}
                    y={pieCentroid[1]}
                    fill='black'
                    textAnchor={'middle'}
                    alignmentBaseline={'middle'}
                    fontSize={22}
                >
                    {data.value}
                </Text>
            )
        })
    }

    if (data.length === 0) {
        getNfces()
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <PieChart style={{ height: 400 }} data={pieData}>
                <Label />
            </PieChart>
        </View>
    )
}