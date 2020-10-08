import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

import { Indicator, Loading } from './Style';

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
            <Indicator>
                <Loading size="large" color="#1CB5E0" />
            </Indicator>
        )
    }
}