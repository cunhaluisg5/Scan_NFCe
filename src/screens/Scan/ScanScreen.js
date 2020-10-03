import React, { Component } from 'react';

import Scan from '../../components/ScanCode/Scan';
import { Container } from './Style';

class TestScan extends Component {
    render() {
        const { navigation } = this.props
        return (
            <Container padding={ 0 } >
                <Scan { ...navigation }/>
            </Container>
        )
    }
}

export default TestScan