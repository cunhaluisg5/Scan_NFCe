import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Container, ButtonContainer, ButtonText } from './Style';

export default class MenuButton extends Component {
  render() {
    return (
      <Container
        onPress={ this.props.onPress }
        underlayColor="rgba(128, 128, 128, 0.1)"
      >
        <ButtonContainer>
          <Icon name={ this.props.name } size={ 25 } 
            style={{ height: 25, width: 25, color: '#ff870f' }} />
          <ButtonText>{ this.props.title }</ButtonText>
        </ButtonContainer>
      </Container>
    );
  }
}