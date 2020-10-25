import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    background: ${props => `${props.background}`};
`;

export const TextTitle = styled.Text`
    display: flex;
    flex: 1;
    font-size: 17px;
    font-weight: bold;
    text-align: center;
    margin-top: 3px;
    margin-right: 5px;
    margin-left: 5px;
    color: ${props => `${props.color}`};
`;

export const Subtitle = styled.Text`
    display: flex;
    flex: 1;
    font-family: sans-serif;
    font-size: 17px;
    font-weight: bold;
    text-align: center;
    margin-top: 3px;
    margin-right: 5px;
    margin-left: 5px;
    color: ${props => `${props.color}`};
`;

export const Category = styled.Text`
    margin-top: 5px;
    margin-bottom: 5px;
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

export const TextInfo = styled.Text`
    text-align: center;
    margin-top: 10px;
    font-size: 16px;
    color: ${props => `${props.color}`};
`;