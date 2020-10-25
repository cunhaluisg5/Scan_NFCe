import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

export const ContainerText = styled.View`
`;

export const Title = styled.Text`
    font-weight: bold;
    font-size: 20px;
    letter-spacing: 1px;
    color: ${props => `${props.color}`};
`;