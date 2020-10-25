import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex-direction: ${props => `${props.flexDirection}`};
    align-items: ${props => `${props.alignItems}`};
    background: ${props => `${props.background}`};
    height: ${props => `${props.height}px`};
    border-radius: ${props => `${props.borderRadius}px`};
    margin-top: ${props => `${props.marginTop}px`};
`;

export const Input = styled.TextInput`
    margin-left: ${props => `${props.marginLeft}px`};
    width: ${props => `${props.width}%`};
`;