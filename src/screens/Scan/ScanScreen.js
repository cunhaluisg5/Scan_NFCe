import React, { Component } from 'react';

import { Container } from './Style';
import Scan from '../../components/ScanCode/Scan';

class TestScan extends Component {
    render() {
        const { navigation } = this.props
        return (
            <Container padding={0} >
                <Scan {...navigation}/>
            </Container>
        )
    }
}

export default TestScan