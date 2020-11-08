import React, { Component } from 'react';

import ModalName from '../../components/ModalName/ModalName';

class ChangeName extends Component {
    render() {
        const { navigation } = this.props
        return (
            <ModalName { ...navigation }/>
        )
    }
}

export default ChangeName