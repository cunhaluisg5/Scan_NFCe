import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

import MenuButton from '../../components/MenuButton/MenuButton';
import { Content, Container, User, Logo, TextEmail, ContainerTop, ContainerBody } from './Style';
import { AppColors } from '../../colors/AppColors';

export default class DrawerContainer extends Component {

  state = {
    user: null,
    errorMessage: null
  };

  logoff = async (navigation) => {
    try {
      await AsyncStorage.removeItem('@APP:token')
      await AsyncStorage.removeItem('@APP:user')
      console.log("Fez logout")
      await navigation.navigate('Auth');
    } catch (error) {
        this.setState({ errorMessage: error })
    }
  }

  searchUser = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('@APP:user'));
      this.setState({ user: user });
    } catch (error) {
        this.setState({ errorMessage: error })
    }
  }

  render() {
    const { navigation } = this.props;
    this.searchUser();
    return (
      <Content background={ AppColors.background }>
        <Container>
          <ContainerTop borderBottomColor={ AppColors.borderBottom2 } 
            background={ AppColors.backgroundWindow }>
            <Logo source={ require('../../../assets/logo.png') } borderColor={ AppColors.borderLogo } />
            <User color={ AppColors.text }>
              {this.state.user !== null && this.state.user.name}
            </User>
            <TextEmail color={ AppColors.text }>
              {this.state.user !== null && this.state.user.email}
            </TextEmail>
          </ContainerTop>
          <ContainerBody>
            <MenuButton
              title="INÍCIO"
              name="home"
              onPress={() => {
                navigation.navigate('Home');
                navigation.closeDrawer();
              }}
            />
            <MenuButton
              title="LEITOR DE CÓDIGO"
              name="qrcode"
              onPress={() => {
                navigation.navigate('Scan', navigation);
                navigation.closeDrawer();
              }}
            />
            <MenuButton
              title="ANÁLISE DE GASTOS"
              name="bar-chart"
              onPress={() => {
                navigation.navigate('Chart', navigation);
                navigation.closeDrawer();
              }}
            />
            <MenuButton
              title="ANÁLISE DE PRODUTOS"
              name="shopping-bag"
              onPress={() => {
                navigation.navigate('Comparison', navigation);
                navigation.closeDrawer();
              }}
            />
            <MenuButton
              title="CONFIGURAÇÕES"
              name="user"
              onPress={() => {
                navigation.navigate('Settings');
                navigation.closeDrawer();
              }}
            />
            <MenuButton
              title="SAIR"
              name="power-off"
              onPress={() => {
                this.logoff(navigation);
                navigation.closeDrawer();
              }}
            />
          </ContainerBody>
        </Container>
      </Content>
    );
  }
}
