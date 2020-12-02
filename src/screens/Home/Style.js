import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    background: ${props => `${props.background}`};
`;

export const TextInfo = styled.Text`
    display: flex;
    flex: 1;
    font-family: sans-serif;
    font-size: 10px;
    font-weight: bold;
    text-align: center;
    margin-top: 1px;
    margin-right: 5px;
    margin-left: 5px;
    color: ${props => `${props.color}`};
`;

export const Indicator = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: ${props => `${props.background}`};
`;

export const Loading = styled.ActivityIndicator`
`;