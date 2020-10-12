import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    background: #0a0d1c
`;

export const Indicator = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: #0a0d1c
`;

export const TextHeader = styled.Text`
    text-align: center;
    font-size: 16px;
    padding: 10px;
    color: #fff;
`;

export const DetailsNfce = styled.Text`
    text-align: center;
    font-size: 16px;
    padding: 10px;
    color: #fff;
    background: #142541;
    width: 100%;
    border-top-width: 2px;
    border-top-color: #7FFFD4;
    border-bottom-width: 2px;
    border-bottom-color: #7FFFD4
`;

export const ContainerText = styled.View`
    background: #142541;
    width: 100%;
    border-top-width: 2px;
    border-top-color: #7FFFD4;
    border-bottom-width: 2px;
    border-bottom-color: #7FFFD4
`;

export const ChartLine = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: #0a0d1c;
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
    background-color: #142541;
    padding: 10px;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 8px;
    border-style: solid; 
    border-right-color: #FFD700;
    border-bottom-color: #FFD700;
    border-left-color: #7FFFD4;
    border-top-color: #7FFFD4;
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 3px;
    border-bottom-width: 3px
`;

export const ItemTitle = styled.Text`
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    color: #ff870f
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