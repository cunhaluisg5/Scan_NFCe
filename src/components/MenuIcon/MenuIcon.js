import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import { HeaderButtonContainer } from './Style';

export default class MenuIcon extends Component {
  render() {
    return (
      <HeaderButtonContainer onPress={this.props.onPress}>
        <Icon name="align-justify" size={25} style={styles.headerButtonImage}/>
      </HeaderButtonContainer>
    );
  }
}

MenuIcon.propTypes = {
  onPress: PropTypes.func
};

const styles = StyleSheet.create({
    headerButtonImage: {
      justifyContent: 'center',
      width: 25,
      height: 25,
      margin: 6
    }
  });