import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    background: ${props => `${props.background}`};
`;

export const Indicator = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: ${props => `${props.background}`};
`;

export const TextHeader = styled.Text`
    text-align: center;
    font-size: 16px;
    padding: 10px;
    color: ${props => `${props.color}`};
`;

export const DetailsNfce = styled.Text`
    text-align: center;
    font-size: 16px;
    padding: 10px;
    width: 100%;
    border-top-width: 2px;
    border-bottom-width: 2px;
    color: ${props => `${props.color}`};
    background: ${props => `${props.background}`};
    border-top-color: ${props => `${props.borderTopColor}`};
    border-bottom-color: ${props => `${props.borderBottomColor}`};
`;

export const ContainerText = styled.View`
    width: 100%;
    border-top-width: 2px;
    border-bottom-width: 2px;
    background: ${props => `${props.background}`};
    border-top-color: ${props => `${props.borderTopColor}`};
    border-bottom-color: ${props => `${props.borderBottomColor}`};
`;

export const ChartLine = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: ${props => `${props.background}`};
`;

export const ContainerNfce = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
`;

export const ItemHeader = styled.TouchableOpacity`
    display: flex;
    flex: 1;
    align-items: center;
    width: 100%;
    min-height: 150px;
    padding: 10px;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 8px;
    border-style: solid; 
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 3px;
    border-bottom-width: 3px;
    border-right-color: ${props => `${props.borderRightColor}`};
    border-bottom-color: ${props => `${props.borderBottomColor}`};
    border-left-color: ${props => `${props.borderLeftColor}`};
    border-top-color: ${props => `${props.borderTopColor}`};
    background: ${props => `${props.background}`};
`;

export const ItemTitle = styled.Text`
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    color: ${props => `${props.color}`};
`;

export const ItemSubtitle = styled.Text`
    margin-top: 10px;
    font-size: ${props => `${props.fontSize}px`};
    color: ${props => `${props.color}`};
`;

export const Scroll = styled.ScrollView`
`;

export const Loading = styled.ActivityIndicator`
`;