import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

import { Indicator, Loading } from './Style';
import { AppColors } from '../../colors/AppColors';

export default class AuthOrApp extends Component {
    UNSAFE_componentWillMount = async () => {
        const token = await AsyncStorage.getItem('@APP:token');

        if (token) {
            this.props.navigation.navigate('Home')
        } else {
            this.props.navigation.navigate('Auth')
        }
    }

    render() {
        return (
            <Indicator background={ AppColors.background } >
                <Loading size="large" color={ AppColors.indicator } />
            </Indicator>
        )
    }
}