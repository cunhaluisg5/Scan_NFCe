import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import { BtnClickContain, BtnContainer, BtnText } from './Style';

export default class MenuButton extends Component {
  render() {
    return (
      <BtnClickContain
        onPress={this.props.onPress}
        underlayColor="rgba(128, 128, 128, 0.1)"
      >
        <BtnContainer>
          <Icon name={this.props.name} size={25} style={{ height: 25, width: 25, color: '#ff870f' }} />
          <BtnText>{this.props.title}</BtnText>
        </BtnContainer>
      </BtnClickContain>
    );
  }
}

MenuButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string
};