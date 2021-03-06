import React, { useState, useEffect } from "react";
import { Alert, Modal, AsyncStorage } from "react-native";

import MenuButton from '../../components/MenuButton/MenuButton';
import AuthInput from '../../components/AuthInput/AuthInput';
import Api from '../../services/Api';
import {
  ModalView, CenteredView, OpenButton, ModalTitle,
  TextStyle, ModalText, ContainerButton, CenteredModal, LogoImage
} from './Style';
import { AppColors } from '../../colors/AppColors';
import Logo from '../../../assets/logo.png';
import OpenURL from '../OpenURL/OpenURL';

export default props => {
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalAboutVisible, setModalAboutVisible] = useState(false);
  const [name, setName] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('@APP:token');
      const user = JSON.parse(await AsyncStorage.getItem('@APP:user'));

      if (token && user) {
        setLoggedInUser(user);
      }

      setName(user.name);

    })();
  }, []);

  const reset = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('@APP:user'));

      const response = await Api.put('/auth/' + user._id, {
        name: name
      });

      const newUser = response.data.user;

      await AsyncStorage.multiSet([
        ['@APP:user', JSON.stringify(newUser)]
      ]);

      setLoggedInUser(newUser);
      setModalEditVisible(!modalEditVisible);

    } catch (response) {
      setErrorMessage(response.data.error);
      Alert.alert('Atenção!', errorMessage);
    }
  };

  const openURL = () => {
    Alert.alert('Atenção', 'Acessar documentação de ajuda?',
      [
        { text: 'Sim', onPress: () => OpenURL('https://helpscannfce.herokuapp.com/') },
        { text: 'Não', onPress: () => console.log('Cancelado'), },
      ]
    );
  }

  const option = (active) => {
    AsyncStorage.setItem('@APP:optionSave', JSON.stringify(active));
    active ? Alert.alert('Ativado!', 'Função habilitada.') 
      : Alert.alert('Desativado!', 'Função desabilitada.');
  }

  const automaticallySave = async () => {
    const optionSave = JSON.parse(await AsyncStorage.getItem('@APP:optionSave'));
    
    if (optionSave) {
      Alert.alert('Atenção', 'Desabilitar função?',
        [
          { text: 'Sim', onPress: () => option(false) },
          { text: 'Não', onPress: () => console.log('Cancelado'), },
        ]
      );
    } else {
      Alert.alert('Atenção', 'Habilitar função?',
        [
          { text: 'Sim', onPress: () => option(true) },
          { text: 'Não', onPress: () => console.log('Cancelado'), },
        ]
      );
    }
  }

  const validForm = name && name.trim()

  return (
    <CenteredView background={AppColors.background}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditVisible}
        onRequestClose={() => {
          setModalEditVisible(!modalEditVisible);
        }}
      >
        <CenteredModal background={AppColors.background}>
          <ModalView background={AppColors.backgroundWindow} borderRightColor={AppColors.borderRight}
            borderBottomColor={AppColors.borderBottom2} borderLeftColor={AppColors.borderLeft2}
            borderTopColor={AppColors.borderTop}>
            <ModalText fontSize={18} color={AppColors.text}>Editar nome de usuário</ModalText>

            <AuthInput icon='user' placeholder='Nome'
              value={name}
              onChangeText={name =>
                setName(name)} />

            <ContainerButton>
              <OpenButton width={80} background={AppColors.button}
                onPress={reset}
                disabled={!validForm}
              >
                <TextStyle fontSize={14} color={AppColors.text}>Salvar</TextStyle>
              </OpenButton>

              <OpenButton width={80} background={AppColors.buttonCancel}
                onPress={() => {
                  setModalEditVisible(!modalEditVisible);
                }}
              >
                <TextStyle fontSize={14} color={AppColors.text}>Cancelar</TextStyle>
              </OpenButton>

            </ContainerButton>
          </ModalView>
        </CenteredModal>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAboutVisible}
        onRequestClose={() => {
          setModalAboutVisible(!modalAboutVisible);
        }}
      >
        <CenteredModal background={AppColors.background}>
          <ModalView background={AppColors.backgroundWindow} borderRightColor={AppColors.borderRight}
            borderBottomColor={AppColors.borderBottom2} borderLeftColor={AppColors.borderLeft2}
            borderTopColor={AppColors.borderTop}>
            <ModalTitle fontSize={20} color={AppColors.text}>Sobre</ModalTitle>
            <LogoImage source={Logo} />
            <ModalText fontSize={14} color={AppColors.text}>Versão 1.0.0</ModalText>
            <ModalText fontSize={14} color={AppColors.text}>2020 - Scan NFC-e</ModalText>
            <ModalText fontSize={14} color={AppColors.text}>Luís Gustavo da Cunha Cipriani</ModalText>

            <ContainerButton>

              <OpenButton width={80} background={AppColors.button}
                onPress={() => {
                  setModalAboutVisible(!modalAboutVisible);
                }}
              >
                <TextStyle fontSize={14} color={AppColors.text}>Fechar</TextStyle>
              </OpenButton>

            </ContainerButton>
          </ModalView>
        </CenteredModal>
      </Modal>

      <MenuButton
        title="Editar nome de usuário"
        name="arrow-right"
        onPress={() => {
          setModalEditVisible(true);
        }}
      />

      <MenuButton
        title="Salvar notas automaticamente"
        name="arrow-right"
        onPress={() => {
          automaticallySave();
        }}
      />

      <MenuButton
        title="Ajuda"
        name="arrow-right"
        onPress={() => {
          openURL();
        }}
      />

      <MenuButton
        title="Sobre"
        name="arrow-right"
        onPress={() => {
          setModalAboutVisible(true);
        }}
      />
    </CenteredView>
  );
};