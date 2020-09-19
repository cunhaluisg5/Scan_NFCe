import { Alert, Linking } from 'react-native';

const Open = (data) => {
    Linking.canOpenURL(data)
        .then((supported) => {
            if (!supported) {
                Alert.alert('Inválido', 'Não foi possível abrir o link ' + data)
            } else {
                Linking.openURL(data)
            }
        })
        .catch((err) => console.error('Ocorreu um erro', err))
};

export default Open;