import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  AsyncStorage
} from "react-native";

import MenuButton from '../../components/MenuButton/MenuButton';
import AuthInput from '../../components/AuthInput/AuthInput';
import Api from '../../services/Api';
import {
  ModalView, CenteredView, OpenButton,
  TextStyle, ModalText, ContainerButton, CenteredModal
} from './Style';

export default props => {
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalAboutVisible, setModalAboutVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      setEmail(user.email);

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
      //setErrorMessage(response.data.error);
      Alert.alert('Atenção!', 'Dados incorretos. ' + response.data)
    }
  };

  const validForm = name && name.trim()

  return (
    <CenteredView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditVisible}
        onRequestClose={() => {
          setModalEditVisible(!modalEditVisible);
        }}
      >
        <CenteredModal>
          <ModalView>
            <ModalText fontSize="18">Editar nome de usuário</ModalText>

            <AuthInput icon='user' placeholder='Nome'
              value={name}
              onChangeText={name =>
                setName(name)} />

            <ContainerButton>
              <OpenButton width="80"
                onPress={reset}
                disabled={!validForm}
              >
                <TextStyle fontSize="14">Editar</TextStyle>
              </OpenButton>

              <OpenButton width="80"
                onPress={() => {
                  setModalEditVisible(!modalEditVisible);
                }}
              >
                <TextStyle fontSize="14">Cancelar</TextStyle>
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
        <CenteredModal>
          <ModalView>
            <ModalText fontSize="18">Sobre</ModalText>

            <ContainerButton>

              <OpenButton width="80"
                onPress={() => {
                  setModalAboutVisible(!modalAboutVisible);
                }}
              >
                <TextStyle fontSize="14">Fechar</TextStyle>
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
        title="Sobre"
        name="arrow-right"
        onPress={() => {
          setModalAboutVisible(true);
        }}
      />
    </CenteredView>
  );
};