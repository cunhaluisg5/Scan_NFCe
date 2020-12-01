import React, { useState, useEffect } from 'react';
import { StyleSheet, Vibration, ActivityIndicator, Alert, AsyncStorage } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import {
  TextContent, ResetButton, Indicator, AlertText, LayerTop,
  LayerCenter, LayerLeft, Focused, LayerRight, LayerBottom
} from './Style';
import Api from '../../services/Api'
import { AppColors } from '../../colors/AppColors';

export default props => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <TextContent color={AppColors.text} fontSize={16} fontWeight={'normal'} textAlign={'center'}
        padding={10}>Solicitando permissão da câmera</TextContent>);
  }
  if (hasPermission === false) {
    return (
      <TextContent color={AppColors.text} fontSize={16} fontWeight={'normal'} textAlign={'center'}
        padding={10}>Sem acesso à câmera</TextContent>);
  }

  const validateURL = (url) => {
    return (url.search(/nfce.fazenda.mg.gov.br/i) !== -1) && (url.length === 156);
  }

  const gravar = async (nfce) => {
    try {
      const response = await Api.post('/nfces', nfce).then(() => {
        console.log('Salvo com sucesso!')
      })

      props.navigation.navigate('HomeScreen');
    } catch (err) {
      Alert.alert('Atenção!', response.data.error);
    }
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    if (validateURL(data)) {
      setScanned(true);
      Vibration.vibrate();
      setIsLoading(true);

      try {
        const response = await Api.post('/crawler', {
          url: data
        });

        const item = {
          ...response.data.nfce.details,
          ...response.data.nfce.detailsNfce,
          items: [...response.data.nfce.items]
        };


        const optionSave = JSON.parse(await AsyncStorage.getItem('@APP:optionSave'));
        if (optionSave) {
          await gravar(response.data);
        } else {
          await props.navigation.navigate('DetailsNfceScreen',
            { item: item, isRecord: true, responseItems: response.data });
        }

        setIsLoading(false);
        setScanned(false);
      } catch (err) {
        setErrorMessage(response.data.error);
        Alert.alert('Atenção!', errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <Indicator background={AppColors.background}>
        <ActivityIndicator size="large" color={AppColors.indicator} />
      </Indicator>
    )
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={StyleSheet.absoluteFill, { flex: 1, backgroundColor: AppColors.opacity }} >
      <LayerTop background={AppColors.opacity}>
        {!scanned &&
          <AlertText color={AppColors.textBold} fontSize={16} fontWeight={'normal'}
            textAlign={'center'} marginTop={0} background={AppColors.backgroundWindow} padding={10}
            borderTopColor={AppColors.borderTop} borderBottomColor={AppColors.borderBottom}>
            Aponte o leitor para o QRCode
            </AlertText>
        }
      </LayerTop>
      <LayerCenter>
        <LayerLeft background={AppColors.opacity} />
        <Focused />
        <LayerRight background={AppColors.opacity} />
      </LayerCenter>
      <LayerBottom background={AppColors.opacity}>
        {scanned &&
          <ResetButton background={AppColors.backgroundWindow} marginTop={125} padding={0}
            borderTopColor={AppColors.borderTop} borderBottomColor={AppColors.borderBottom}
            onPress={() => setScanned(false)}>
            <TextContent color={AppColors.textBold} fontSize={16} fontWeight={'normal'}
              textAlign={'center'} padding={10}>Ler novamente</TextContent>
          </ResetButton>
        }
      </LayerBottom>
    </BarCodeScanner>
  )
}