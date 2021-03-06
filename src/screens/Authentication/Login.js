import React, { Component } from 'react';
import { AsyncStorage, Alert } from 'react-native';

import Api from '../../services/Api';
import AuthInput from '../../components/AuthInput/AuthInput';

import {
    Container, ContainerLogin, Loading, SubtitleHeader,
    FormContainer, Indicator, ButtonLogin, Logo
} from './Style';

import { AppColors } from '../../colors/AppColors';

export default class Login extends Component {
    state = {
        stageNew: false,
        name: '',
        email: '',
        password: '',
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
            Alert.alert('Atenção!', this.state.errorMessage)
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
            Alert.alert('Atenção!', 'Cadastro efetuado com sucesso.');
            this.setState({ stageNew: false })
        } catch (response) {
            this.setState({ isLoading: false })
            this.setState({ errorMessage: response.data.error })
            Alert.alert('Atenção!', this.state.errorMessage)
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

    onPressReset = () => {
        this.props.navigation.navigate('ResetPassword', { email: this.state.email });
    };

    render() {
        if (this.state.isLoading) {
            return (
                <Indicator background={AppColors.background}>
                    <Loading size="large" color={AppColors.indicator} />
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
            <Container background={AppColors.background}>
                { !this.state.stageNew ? <Logo source={require('../../../assets/logo.png')}
                    borderColor={AppColors.borderLogo} marginTop={0} />
                    : <Logo source={require('../../../assets/logo.png')}
                        borderColor={AppColors.borderLogo} marginTop={50} />}
                <FormContainer background={AppColors.background}>
                    <SubtitleHeader color={AppColors.text}>
                        {this.state.stageNew ?
                            'Crie a sua conta' : 'Informe seus dados'}
                    </SubtitleHeader>
                    {this.state.stageNew &&
                        <AuthInput icon='user' placeholder='Nome'
                            value={this.state.name}
                            onChangeText={name =>
                                this.setState({ name })} />}
                    <AuthInput icon='at' placeholder='E-mail'
                        value={this.state.email}
                        onChangeText={email =>
                            this.setState({ email })} />
                    <AuthInput icon='lock' secureTextEntry={true}
                        placeholder='Senha'
                        value={this.state.password}
                        onChangeText={password =>
                            this.setState({ password })} />
                    {this.state.stageNew &&
                        <AuthInput icon='asterisk'
                            secureTextEntry={true} placeholder='Confirmação'
                            value={this.state.confirmPassword}
                            onChangeText={confirmPassword =>
                                this.setState({ confirmPassword })} />}
                    <ContainerLogin disabled={!validForm}
                        onPress={this.signInOrSignUp}>
                        <ButtonLogin background={AppColors.button}
                            style={[!validForm ? { backgroundColor: AppColors.inactiveButton } : {}]}>
                            <SubtitleHeader color={AppColors.text}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </SubtitleHeader>
                        </ButtonLogin>
                    </ContainerLogin>
                </FormContainer>
                <ContainerLogin style={{ padding: 10 }}
                    onPress={() => this.setState({
                        stageNew: !this.state.stageNew
                    })}>
                    <SubtitleHeader color={AppColors.text}>
                        {this.state.stageNew ? 'Já possui conta?'
                            : 'Criar uma conta'}
                    </SubtitleHeader>
                </ContainerLogin>
                <ContainerLogin style={{ padding: 10 }}
                    onPress={ this.onPressReset }>
                    <SubtitleHeader color={AppColors.textBold}>
                        {!this.state.stageNew && 'Esqueceu sua senha?'}
                    </SubtitleHeader>
                </ContainerLogin>
            </Container>
        )
    }
}