import styled from 'styled-components/native';

export const Content = styled.View`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: center;
    background-color: #0a0d1c
`;

export const Container = styled.View`
    display: flex;
    flex: 1;
    align-items: flex-start;
`;

export const ContainerTop = styled.View`
    margin-bottom: 20px;
    border-style: solid; 
    border-bottom-color: #FFD700;
    border-bottom-width: 1px;
    width: 100%;
    padding: 20px;
    background: #142541;
`;

export const ContainerBody = styled.View`
    width: 100%;
    padding: 20px
`;

export const User = styled.Text`
    font-size: 20px;
    color: #fff;
    margin-top: 10px
`;

export const Logo = styled.View`
    background: #7FFFD4;
    width: 60px;
    height: 60px;
    border-radius: 30px;
`;

export const TextLogo = styled.Text`
    font-size: 20px;
    color: #000000;
    text-align: center;
    margin-top: 15px
`;

export const TextEmail = styled.Text`
    font-size: 14px;
    color: #ffffff;
    margin-top: 15px;
`;