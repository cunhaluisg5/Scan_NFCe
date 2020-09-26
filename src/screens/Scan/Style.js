console.disableYellowBox = true
import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    padding: ${props => `${props.padding}px`};
    background: #0a0d1c
`;