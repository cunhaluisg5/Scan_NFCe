import styled from 'styled-components/native';

export const Content = styled.View`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: center;
    background: ${props => `${props.background}`};
`;

export const Container = styled.View`
    display: flex;
    flex: 1;
    align-items: flex-start;
`;

export const ContainerTop = styled.View`
    margin-bottom: 20px;
    border-style: solid; 
    border-bottom-width: 1px;
    width: 100%;
    padding: 20px;
    border-bottom-color: ${props => `${props.borderBottomColor}`};
    background: ${props => `${props.background}`};
`;

export const ContainerBody = styled.View`
    width: 100%;
    padding: 20px;
`;

export const User = styled.Text`
    font-size: 20px;
    margin-top: 10px;
    color: ${props => `${props.color}`};
`;

export const Logo = styled.View`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background: ${props => `${props.background}`};
`;

export const TextLogo = styled.Text`
    font-size: 20px;
    text-align: center;
    margin-top: 15px;
    color: ${props => `${props.color}`};
`;

export const TextEmail = styled.Text`
    font-size: 14px;
    margin-top: 15px;
    color: ${props => `${props.color}`};
`;