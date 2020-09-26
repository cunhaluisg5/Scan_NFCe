console.disableYellowBox = true
import styled from 'styled-components/native';

export const TextContent = styled.Text`
    font-size: ${props => `${props.fontSize}`};
    color: ${props => `${props.color}`};
    font-weight: ${props => `${props.fontWeight}`};
    text-align: ${props => `${props.textAlign}`};
    padding: ${props => `${props.padding}px`};
`;

export const AlertText = styled.Text`
    padding: ${props => `${props.padding}px`};
    color: ${props => `${props.color}`};
    background: ${props => `${props.background}`};
    font-size: ${props => `${props.fontSize}`};
    font-weight: ${props => `${props.fontWeight}`};
    text-align: ${props => `${props.textAlign}`};
    border-top-width: 1px;
    border-top-color: #7FFFD4;
    border-bottom-width: 1px;
    border-bottom-color: #7FFFD4;
`;

export const ResetButton = styled.TouchableOpacity`
    margin-top: ${props => `${props.marginTop}`};
    padding: ${props => `${props.padding}px`};
    background: ${props => `${props.background}`};
    border-top-width: 1px;
    border-top-color: #7FFFD4;
    border-bottom-width: 1px;
    border-bottom-color: #7FFFD4;
`;

export const Indicator = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: ${props => `${props.background}`};
`;

export const LayerTop = styled.View`
    display: flex;
    flex: 1;
    background: ${props => `${props.background}`};
`;

export const LayerCenter = styled.View`
    display: flex;
    flex: 1;
    flex-direction: row;
`;

export const LayerLeft = styled.View`
    display: flex;
    flex: 1;
    background: ${props => `${props.background}`};
`;

export const Focused = styled.View`
    display: flex;
    flex: 10;
`;

export const LayerRight = styled.View`
    display: flex;
    flex: 1;
    background: ${props => `${props.background}`};
`;

export const LayerBottom = styled.View`
    display: flex;
    flex: 1;
    background: ${props => `${props.background}`};
`;