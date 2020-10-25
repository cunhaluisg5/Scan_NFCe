import styled from 'styled-components/native';

export const ModalView = styled.View`
    display: flex;
    margin: 20px;    
    border-radius: 20px;
    padding: 30px;
    align-items: center;
    border-style: solid;     
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 3px;
    border-bottom-width: 3px;
    background: ${props => `${props.background}`};
    border-right-color: ${props => `${props.borderRightColor}`};
    border-bottom-color: ${props => `${props.borderBottomColor}`};
    border-left-color: ${props => `${props.borderLeftColor}`};
    border-top-color: ${props => `${props.borderTopColor}`};
`;

export const CenteredView = styled.View`
    display: flex;
    flex: 1;
    padding: 10px;
    background: ${props => `${props.background}`};
`;

export const CenteredModal = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: ${props => `${props.background}`};
`;

export const OpenButton = styled.TouchableHighlight`
    border-radius: 20px;
    padding: 10px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    background: ${props => `${props.background}`};
    width: ${props => `${props.width}px`};
`;

export const TextStyle = styled.Text`
    text-align: center;
    color: ${props => `${props.color}`};
    font-size: ${props => `${props.fontSize}px`};
`;

export const ModalText = styled.Text`
    margin-bottom: 15px;
    text-align: center;
    color: ${props => `${props.color}`};
    font-size: ${props => `${props.fontSize}px`};
`;

export const ContainerButton = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`;