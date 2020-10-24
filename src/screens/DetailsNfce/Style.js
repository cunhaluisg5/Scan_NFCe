import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    background: ${props => `${props.backgroundColor}`};
`;

export const ItemHeader = styled.View`
    display: flex;
    flex: 1;
    align-items: ${props => `${props.alignItems}`};
    max-height: ${props => `${props.maxHeight}px`};
    background: ${props => `${props.backgroundColor}`};
`;

export const ItemBody = styled.View`
    display: flex;
    flex: 1;
    align-items: ${props => `${props.alignItems}`};
    padding: ${props => `${props.padding}px`};
    border-top-width: ${props => `${props.borderTopWidth}px`};
    border-bottom-width: ${props => `${props.borderBottomWidth}px`};
    border-top-color: ${props => `${props.borderTopColor}`};
    border-bottom-color: ${props => `${props.borderBottomColor}`};
`;

export const ItemFooter = styled.View`
    display: flex;
    flex: 1;
    justify-content: ${props => `${props.justifyContent}`};
    font-weight: ${props => `${props.fontWeight}`};
    max-height: ${props => `${props.maxHeight}px`};
    padding: ${props => `${props.padding}px`};
    background: ${props => `${props.backgroundColor}`};
`;

export const ItemTitle = styled.Text`
    font-size: ${props => `${props.fontSize}px`};
    font-weight: ${props => `${props.fontWeight}`};
    margin-top: ${props => `${props.marginTop}px`};
    color: ${props => `${props.color}`};
`;

export const ItemSubtitle = styled.Text`
    font-size: ${props => `${props.fontSize}px`};
    margin-top: ${props => `${props.marginTop}px`};
    color: ${props => `${props.color}`};
`;

export const ItemScroll = styled.ScrollView`
    width: ${props => `${props.width}%`};
    padding: ${props => `${props.padding}px`};
`;

export const Items = styled.View`
    display: flex;
    flex: 1;
    margin-bottom: ${props => `${props.marginBottom}px`};
    padding: ${props => `${props.padding}px`};
    background: ${props => `${props.backgroundColor}`};
    border-radius: ${props => `${props.borderRadius}px`};
    border-style: ${props => `${props.borderStyle}`};
    border-right-color: ${props => `${props.borderRightColor}`};
    border-bottom-color: ${props => `${props.borderBottomColor}`};
    border-left-color: ${props => `${props.borderLeftColor}`};
    border-top-color: ${props => `${props.borderTopColor}`};
    border-top-width: ${props => `${props.borderTopWidth}px`};
    border-left-width: ${props => `${props.borderLeftWidth}px`};
    border-right-width: ${props => `${props.borderRightWidth}px`};
    border-bottom-width: ${props => `${props.borderBottomWidth}px`};
`;

export const ContainerItems = styled.View`
    display: flex;
    flex: 1;
    flex-direction: ${props => `${props.flexDirection}`};
    align-items: ${props => `${props.alignItems}`};
    justify-content: ${props => `${props.justifyContent}`};
`;

export const ItemText = styled.Text`
    font-size: ${props => `${props.fontSize}px`};
    color: ${props => `${props.color}`};
`;