import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    margin: 10px 10px 10px 10px;
    border-left-width: 2px;
    border-top-width: 2px;
    border-right-width: 2px;
    border-bottom-width: 2px;
    border-left-color: ${props => `${props.borderLeftColor}`};
    border-top-color: ${props => `${props.borderTopColor}`};
    border-right-color: ${props => `${props.borderRightColor}`};
    border-bottom-color: ${props => `${props.borderBottomColor}`};
    background: ${props => `${props.backgroundColor}`};
`;

export const ItemHeader = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    max-height: 50px;
    background: ${props => `${props.backgroundColor}`};
`;

export const ItemBody = styled.View`
    display: flex;
    flex: 1;
    align-items: flex-start;
    padding: 10px;    
    background: ${props => `${props.backgroundColor}`};
`;

export const ItemFooter = styled.View`
    display: flex;
    flex: 1;
    justify-content: center;
    font-weight: bold;
    max-height: 70px;
    padding: 10px;
    background: ${props => `${props.backgroundColor}`};
`;

export const ItemTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
    color: ${props => `${props.color}`};
`;

export const ItemScroll = styled.ScrollView`
    width: 100%;
    background: ${props => `${props.backgroundColor}`};    
`;

export const Items = styled.View`
    display: flex;
    flex: 1;
    margin-bottom: 15px;
    padding: 10px;    
    border-radius: 8px;
    border-style: solid;    
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 3px;
    border-bottom-width: 3px;
    background: ${props => `${props.backgroundColor}`};
    border-right-color: ${props => `${props.borderRightColor}`};
    border-bottom-color: ${props => `${props.borderBottomColor}`};
    border-left-color: ${props => `${props.borderLeftColor}`};
    border-top-color: ${props => `${props.borderTopColor}`};
`;

export const ContainerItems = styled.View`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const ItemText = styled.Text`
    font-size: ${props => `${props.fontSize}px`};
    color: ${props => `${props.color}`};
`;