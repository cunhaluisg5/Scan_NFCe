import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    background: ${props => `${props.background}`};
`;

export const TitleHeader = styled.Text`
    font-size: 50px;
    margin-bottom: 10px;
    color: ${props => `${props.color}`};
`;

export const SubtitleHeader = styled.Text`
    font-size: 20px;
    text-align: center;
    color: ${props => `${props.color}`};
`;

export const FormContainer = styled.View`
    padding: 20px;
    width: 90%;
    background: ${props => `${props.background}`};
`;

export const Indicator = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: ${props => `${props.background}`};
`;

export const ButtonLogin = styled.View`
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 10px;
    background: ${props => `${props.background}`};
`;

export const Logo = styled.Image`
    width: 150px;
    height: 150px;
    border-width: 2px;
    border-color: ${props => `${props.borderColor}`};
`;

export const ContainerLogin = styled.TouchableOpacity`
`;

export const Loading = styled.ActivityIndicator`
`;