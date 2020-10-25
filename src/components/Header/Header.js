import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import { Container, ContainerText, Title } from './Style';
import { AppColors } from '../../colors/AppColors';

export default function Header({ title, navigation }) {

  const openMenu = () => {
    navigation.openDrawer();
  }

  return (
    <Container>
      <MaterialIcons name='menu' size={ 28 } onPress={ openMenu } 
        style={{ position: 'absolute', left: 16, }} />
      <ContainerText>
        <Title color={ AppColors.textHeader }>{ title }</Title>
      </ContainerText>
    </Container>
  );
}