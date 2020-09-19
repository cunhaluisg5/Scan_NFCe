import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';

import MenuButton from '../../components/MenuButton/MenuButton';
import { Content, Container } from './Style';

export default class DrawerContainer extends Component {

  logoff = async () => {
    try {
      await AsyncStorage.removeItem('@APP:token')
      await AsyncStorage.removeItem('@APP:user')
      console.log("Fez logout")
    } catch(error) {
      console.log("Não conseguiu fazer logout ", error)
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <Content>
        <Container>
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
              this.logoff();
              navigation.navigate('Auth');
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
