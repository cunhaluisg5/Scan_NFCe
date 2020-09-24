import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    background: #0a0d1c
`;

export const ItemHeader = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    max-height: 120px;
    background-color: #142541
`;

export const ItemBody = styled.View`
    display: flex;
    flex: 1;
    align-items: flex-start;
    padding: 10px;
    border-top-width: 2px;
    border-top-color: #7FFFD4;
    border-bottom-width: 2px;
    border-bottom-color: #FFD700
`;

export const ItemFooter = styled.View`
    display: flex;
    flex: 1;
    justify-content: center;
    font-weight: bold;
    max-height: 50px;
    padding: 10px;
    background-color: #142541
`;

export const ItemTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
    color: #ff870f
`;

export const ItemSubtitle = styled.Text`
    font-size: 14px;
    margin-top: 5px;
    color: #fff
`;

export const ItemScroll = styled.ScrollView`
    width: 100%;
    padding: 10px
`;

export const Items = styled.View`
    display: flex;
    flex: 1;
    margin-bottom: 15px;
    padding: 10px;
    background: #142541;
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

export const ContainerItems = styled.View`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between
`;

export const ItemText = styled.Text`
    margin-top: 10px;
    font-size: 14px;
    color: #fff
`;

export const Indicator = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: #000000
`;