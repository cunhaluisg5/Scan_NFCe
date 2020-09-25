console.disableYellowBox = true
import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    padding: ${props => `${props.padding}px`}
`;

export const Content = styled(Container)`
    justify-content: ${props => `${props.justifyContent}`};
    align-Items: ${props => `${props.alignItems}`};
`;

export const Text = styled.Text`
    font-size: ${props => `${props.fontSize}`};
    color: ${props => `${props.color}`};
    margin-top: ${props => `${props.marginTop}`};
    margin-bottom: ${props => `${props.marginBottom}`};
    font-weight: ${props => `${props.fontWeight}`}
`;

export const ButtonBack = styled.TouchableOpacity`
    margin-top: ${props => `${props.marginTop}`};
    padding: ${props => `${props.padding}px`}
`;

export const Button = styled(ButtonBack)`
    background: ${props => `${props.background}`};
`;

export const Indicator = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: #000000
`;