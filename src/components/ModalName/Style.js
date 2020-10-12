import styled from 'styled-components/native';

export const ModalView = styled.View`
    display: flex;
    margin: 20px;
    background: #142541;
    border-radius: 20px;
    padding: 30px;
    align-items: center;
    border-style: solid; 
    border-right-color: #FFD700;
    border-bottom-color: #FFD700;
    border-left-color: #7FFFD4;
    border-top-color: #7FFFD4;
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 3px;
    border-bottom-width: 3px;
`;

export const CenteredView = styled.View`
    display: flex;
    flex: 1;
    background: #0a0d1c;
    padding: 10px
`;

export const CenteredModal = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: #0a0d1c
`;

export const OpenButton = styled.TouchableHighlight`
    background: #0a0d1c;
    border-radius: 20px;
    padding: 10px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    width: ${props => `${props.width}px`};
`;

export const TextStyle = styled.Text`
    color: #ffffff;
    text-align: center;
    font-size: ${props => `${props.fontSize}px`};
`;

export const ModalText = styled.Text`
    margin-bottom: 15px;
    font-size: ${props => `${props.fontSize}px`};
    text-align: center;
    color: #ffffff;
`;

export const ContainerButton = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`;