import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    background: #000000
`;

export const TitleHeader = styled.Text`
    color: #ffffff;
    font-size: 50px;
    margin-bottom: 10px
`;

export const SubtitleHeader = styled.Text`
    color: #ffffff;
    font-size: 20px
`;

export const FormContainer = styled.View`
    background: rgba(0,0,0,0.8);
    padding: 20px;
    width: 90%
`;

export const Indicator = styled.View`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background: #000000
`;

export const ButtonLogin = styled.View`
    display: flex;
    align-items: center;
    background: #053480;
    margin-top: 10px;
    padding: 10px;
`;

export const ContainerLogin = styled.TouchableOpacity`
`;

export const Loading = styled.ActivityIndicator`
`;