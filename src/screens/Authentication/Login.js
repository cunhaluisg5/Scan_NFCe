import React, { Component } from 'react';
import { AsyncStorage, Alert } from 'react-native';

import Api from '../../services/Api';
import AuthInput from '../../components/AuthInput/AuthInput';

import {
    Container, TitleHeader, ContainerLogin, Loading, SubtitleHeader,
    FormContainer, Indicator, ButtonLogin
} from './Style';

export default class Login extends Component {
    state = {
        stageNew: false,
        name: '',
        email: 'luisg5@yahoo.com.br',
        password: '123456',
        confirmPassword: '',
        isLoading: false,
        loggedInUser: null,
        errorMessage: null
    };

    signIn = async () => {
        try {
            this.setState({ isLoading: true })
            const { email, password } = this.state

            const response = await Api.post('/auth/authenticate', {
                email,
                password
            });

            const { user, token } = response.data;

            await AsyncStorage.multiSet([
                ['@APP:token', token],
                ['@APP:user', JSON.stringify(user)]
            ]);

            this.setState({ loggedInUser: user });

            this.props.navigation.navigate('Home', { user })
            this.setState({ isLoading: false })
        } catch (response) {
            this.setState({ isLoading: false })
            this.setState({ errorMessage: response.data.error })
            Alert.alert('Atenção!', 'Dados incorretos. ' + response.data.error)
        }
    };

    signUp = async () => {
        try {
            this.setState({ isLoading: true })
            const { name, email, password } = this.state

            const response = await Api.post('/auth/register', {
                name,
                email,
                password
            });
            this.setState({ isLoading: false })
            Alert.alert('Cadastro com sucesso!');
            this.setState({ stageNew: false })
        } catch (response) {
            this.setState({ isLoading: false })
            this.setState({ errorMessage: response.data.error })
            Alert.alert('Atenção!', 'Erro ao cadastrar. ' + response.data.error)
        }
    };

    signInOrSignUp = () => {
        if (this.state.stageNew) {
            this.signUp()
        } else {
            this.signIn()
        }
    };

    async componentDidMount() {
        const token = await AsyncStorage.getItem('@APP:token');
        const user = JSON.parse(await AsyncStorage.getItem('@APP:user'));

        if (token && user) {
            this.setState({ loggedInUser: user })
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Indicator>
                    <Loading size="large" color="#1CB5E0" />
                </Indicator>
            )
        }

        const validations = []

        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim())
            validations.push(this.state.confirmPassword)
            validations.push(this.state.password === this.state.confirmPassword)
        }

        const validForm = validations.reduce((all, v) => all && v)

        return (
            <Container>
                <TitleHeader>Scan NFCe</TitleHeader>
                <FormContainer>
                    <SubtitleHeader>
                        { this.state.stageNew ?
                            'Crie a sua conta' : 'Informe seus dados' }
                    </SubtitleHeader>
                    { this.state.stageNew &&
                        <AuthInput icon='user' placeholder='Nome'
                            value={ this.state.name }
                            onChangeText={ name =>
                                this.setState({ name }) } /> }
                    <AuthInput icon='at' placeholder='E-mail'
                        value={ this.state.email }
                        onChangeText={ email =>
                            this.setState({ email }) } />
                    <AuthInput icon='lock' secureTextEntry={true}
                        placeholder='Senha'
                        value={ this.state.password }
                        onChangeText={ password =>
                            this.setState({ password }) } />
                    { this.state.stageNew &&
                        <AuthInput icon='asterisk'
                            secureTextEntry={ true } placeholder='Confirmação'
                            value={ this.state.confirmPassword }
                            onChangeText={ confirmPassword =>
                                this.setState({ confirmPassword }) } /> }
                    <ContainerLogin disabled={ !validForm }
                        onPress={ this.signInOrSignUp }>
                        <ButtonLogin style={ [!validForm ? { backgroundColor: '#AAA' } : {}] }>
                            <SubtitleHeader>
                                { this.state.stageNew ? 'Registrar' : 'Entrar' }
                            </SubtitleHeader>
                        </ButtonLogin>
                    </ContainerLogin>
                </FormContainer>
                <ContainerLogin style={{ padding: 10 }}
                    onPress={() => this.setState({
                        stageNew: !this.state.stageNew
                    })}>
                    <SubtitleHeader>
                        { this.state.stageNew ? 'Já possui conta?'
                            : 'Ainda não possui conta?' }
                    </SubtitleHeader>
                </ContainerLogin>
            </Container>
        )
    }
}