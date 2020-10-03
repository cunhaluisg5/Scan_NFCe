import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    background: #0a0d1c
`;

export const TextTitle = styled.Text`
    display: flex;
    flex: 1;
    font-size: 17px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    margin-top: 3px;
    margin-right: 5px;
    margin-left: 5px
`;

export const Subtitle = styled.Text`
    display: flex;
    flex: 1;
    font-family: sans-serif;
    font-size: 17px;
    font-weight: bold;
    text-align: center;
    color: #ff870f;
    margin-top: 3px;
    margin-right: 5px;
    margin-left: 5px
`;

export const Category = styled.Text`
    margin-top: 5px;
    margin-bottom: 5px;
    color: #fff
`;

export const Indicator = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: #000000
`;

export const Loading = styled.ActivityIndicator`
`;

export const TextInfo = styled.Text`
    color: #ffffff;
    text-align: center;
    margin-top: 10px;
    font-size: 16px;
    font-family: Helvetica
`;