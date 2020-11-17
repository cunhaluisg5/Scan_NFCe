import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Container, Input } from './Style';
import { AppColors } from '../../colors/AppColors';

export default props => {
    return (
        <Container flexDirection={ 'row' } alignItems={ 'center' } background={ AppColors.backgroundInput } 
            height={ 45 } borderRadius={ 20 } marginTop={ 10 } >
            <Icon name={ props.icon } size={ 20 } 
                style={{ color: AppColors.iconInput, marginLeft: 20 }} />
            <Input { ...props } marginLeft={ 20 } width={ 70 } />
        </Container>
    )
}