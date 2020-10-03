import styled from 'styled-components/native';

export const Container = styled.TouchableHighlight`
    display: flex;
    flex-direction: row;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 5px
`;

export const ButtonContainer = styled.View`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: flex-start
`;

export const ButtonText = styled.Text`
    font-size: 16px;
    margin-left: 10px;
    margin-top: 2px;
    color: #fff
`;