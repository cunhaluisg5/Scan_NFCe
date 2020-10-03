import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

import { Container, Input } from './Style';

export default props => {
    return (
        <Container>
            <Icon name={ props.icon } size={ 20 } 
                style={{ color: '#333', marginLeft: 20 }} />
            <Input { ...props } 
                keyboardType='email-address' />
        </Container>
    )
}