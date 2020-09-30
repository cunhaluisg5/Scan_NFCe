import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';

import MenuButton from '../../components/MenuButton/MenuButton';
import { Content, Container, User } from './Style';

export default class DrawerContainer extends Component {

  state = {
    user: null
  };

  logoff = async (navigation) => {
    try {
      await AsyncStorage.removeItem('@APP:token')
      await AsyncStorage.removeItem('@APP:user')
      console.log("Fez logout")
      await navigation.navigate('Auth');
    } catch (error) {
      console.log("Não conseguiu fazer logout ", error)
    }
  }

  searchUser = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('@APP:user'));
      this.setState({ user: user });
    } catch (error) {
      console.log("Erro ao buscar usuário", error)
    }
  }

  render() {
    const { navigation } = this.props;
    this.searchUser();
    return (
      <Content>
        <Container>
          <User>
            {this.state.user !== null && this.state.user.name}
          </User>
          <MenuButton
            title="INÍCIO"
            name="home"
            onPress={() => {
              navigation.navigate('Home');
              navigation.closeDrawer();
            }}
          />
          <MenuButton
            title="LEITOR"
            name="qrcode"
            onPress={() => {
              navigation.navigate('Scan', navigation);
              navigation.closeDrawer();
            }}
          />
          <MenuButton
            title="GRÁFICO"
            name="qrcode"
            onPress={() => {
              navigation.navigate('Chart', navigation);
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
        </Container>
      </Content>
    );
  }
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  })
};
