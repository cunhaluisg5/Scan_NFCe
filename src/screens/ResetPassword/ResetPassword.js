import React, { Component } from 'react';
import { Alert } from 'react-native';

import Api from '../../services/Api';
import AuthInput from '../../components/AuthInput/AuthInput';
import {
    Container, ContainerLogin, SubtitleHeader, Indicator,
    FormContainer, ButtonLogin, Logo, Loading
} from './Style';
import { AppColors } from '../../colors/AppColors';

export default class DetailsNfceScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isLoading: false,
            errorMessage: null
        }
    }

    reset = async () => {
        try {
            this.setState({ isLoading: true })
            const response = await Api.post('/auth/forgot_password', {
                email: this.state.email
            });

            Alert.alert('Atenção!', 'Instruções enviadas para o e-mail informado.');
            this.setState({ isLoading: false })
        } catch (response) {
            this.setState({ isLoading: false })
            this.setState({ errorMessage: response.data.error })
            Alert.alert('Atenção!', this.state.errorMessage)
        }
    };

    login = async () => {
        this.props.navigation.navigate('Auth')
    };

    render() {
        const validations = []

        validations.push(this.state.email && this.state.email.includes('@'))

        const validForm = validations.reduce((all, v) => all && v)

        if (this.state.isLoading) {
            return (
                <Indicator background={AppColors.background}>
                    <Loading size="large" color={AppColors.indicator} />
                </Indicator>
            )
        }

        return (
            <Container background={AppColors.background}>
                <Logo source={require('../../../assets/logo.png')}
                    borderColor={AppColors.borderLogo} marginTop={0} />
                <FormContainer background={AppColors.background}>
                    <SubtitleHeader color={AppColors.text}>
                        Preencha o e-mail cadastrado
                    </SubtitleHeader>
                    <AuthInput icon='at' placeholder='E-mail'
                        value={this.state.email}
                        onChangeText={email =>
                            this.setState({ email })} />
                    <ContainerLogin disabled={!validForm}
                        onPress={this.reset}>
                        <ButtonLogin background={AppColors.button}
                            style={[!validForm ? { backgroundColor: AppColors.inactiveButton } : {}]}>
                            <SubtitleHeader color={AppColors.text}>
                                Enviar
                            </SubtitleHeader>
                        </ButtonLogin>
                    </ContainerLogin>
                </FormContainer>
                <ContainerLogin style={{ padding: 10 }}
                    onPress={ this.login }>
                    <SubtitleHeader color={AppColors.text}>
                        Fazer Login
                    </SubtitleHeader>
                </ContainerLogin>
            </Container>
        );
    }
}