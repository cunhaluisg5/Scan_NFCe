import styled from 'styled-components/native';

export const Indicator = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: ${props => `${props.background}`};
`;

export const Loading = styled.ActivityIndicator`
`;