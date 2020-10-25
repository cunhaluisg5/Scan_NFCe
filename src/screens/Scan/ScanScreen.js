import React, { Component } from 'react';

import Scan from '../../components/ScanCode/Scan';
import { Container } from './Style';
import { AppColors } from '../../colors/AppColors';

class TestScan extends Component {
    render() {
        const { navigation } = this.props
        return (
            <Container padding={ 0 } background = { AppColors.background }>
                <Scan { ...navigation }/>
            </Container>
        )
    }
}

export default TestScan