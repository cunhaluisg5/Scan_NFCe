import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    AsyncStorage,
    Alert,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import Api from '../../services/Api';
import AuthInput from '../../components/AuthInput/AuthInput';

import { 
    Container,
    TitleHeader,
    SubtitleHeader,
    FormContainer,
    Indicator
} from './Style';

export default class Settings extends Component {
    state = {
        stageNew: false,
        name: '',
        email: '',
        isLoading: false,
        loggedInUser: null,
        errorMessage: null
    };

    reset = async () => {
        try {
            this.setState({ isLoading: true })
            const user = JSON.parse(await AsyncStorage.getItem('@APP:user'));
            const { name } = this.state

            const response = await Api.put('/auth/' + user._id, {
                name: name
            });

            user = response.data.user;

            await AsyncStorage.multiSet([
                ['@APP:user', JSON.stringify(user)]
            ]);

            this.setState({ loggedInUser: user });

            //this.props.navigation.navigate('Home', {user})
            this.setState({ isLoading: false })
        } catch (response) {
            this.setState({ isLoading: false })
            this.setState({ errorMessage: response.data.error })
            Alert.alert('Atenção!','Dados incorretos. ' + response.data.error)
        }
    };

    async componentDidMount() {
        const token = await AsyncStorage.getItem('@APP:token');

        const user = JSON.parse(await AsyncStorage.getItem('@APP:user'));

        if (token && user) {
            this.setState({ loggedInUser: user })
        }

        this.setState({
            name: user.name,
            email: user.email
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Indicator>
                    <ActivityIndicator size="large" color="#1CB5E0" />
                </Indicator>
            )
        }

        const validForm = this.state.name && this.state.name.trim()

        return (
            <Container>
                <FormContainer>
                    <AuthInput icon='user' placeholder='Nome'
                        style={styles.input}
                        value={this.state.name}
                        onChangeText={name =>
                            this.setState({ name })} />
                    <AuthInput icon='at' placeholder='E-mail'
                        style={styles.input}
                        value={this.state.email}
                        editable={false}/>
                    <TouchableOpacity disabled={!validForm}
                        onPress={this.reset}>
                        <View style={[styles.button, !validForm ? { backgroundColor: '#AAA' } : {}]}>
                            <SubtitleHeader>Editar</SubtitleHeader>
                        </View>
                    </TouchableOpacity>
                </FormContainer>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#053480',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
});