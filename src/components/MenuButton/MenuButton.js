import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Container, ButtonContainer, ButtonText } from './Style';
import { AppColors } from '../../colors/AppColors';

export default class MenuButton extends Component {
  render() {
    return (
      <Container
        onPress={ this.props.onPress }
        underlayColor={ AppColors.menuButton }
      >
        <ButtonContainer>
          <Icon name={ this.props.name } size={ 25 }
            style={{ height: 25, width: 25, color: AppColors.textBold }} />
          <ButtonText color={ AppColors.text }>{ this.props.title }</ButtonText>
        </ButtonContainer>
      </Container>
    );
  }
}