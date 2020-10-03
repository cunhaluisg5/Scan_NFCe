import React, { useState, useEffect } from 'react';
import { StyleSheet, Vibration, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { TextContent, ResetButton, Indicator, AlertText, LayerTop, 
         LayerCenter, LayerLeft, Focused, LayerRight, LayerBottom } from './Style';
import Api from '../../services/Api'

const opacity = 'rgba(0, 0, 0, .6)';

export default props => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return (
        <TextContent color={ '#ffffff' } fontSize={ 16 } fontWeight={ 'normal' } textAlign={ 'center' }
        padding={ 10 }>Solicitando permissão da câmera</TextContent>);
  }
  if (hasPermission === false) {
    return (
      <TextContent color={ '#ffffff' } fontSize={ 16 } fontWeight={ 'normal' } textAlign={ 'center' }
              padding={ 10 }>Sem acesso à câmera</TextContent>);
  }

  const validateURL = (url) => {
    return (url.search(/nfce.fazenda.mg.gov.br/i) !== -1) && (url.length === 156);
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

        props.navigation.navigate('DetailsNfceScreen', { item: item, isRecord: true, da: response.data });
        setIsLoading(false);
      } catch (err) {
        console.log('Erro ', err)
      }
    }
  };

  if (isLoading) {
    return (
      <Indicator background={ '#0a0d1c' }>
        <ActivityIndicator size="large" color="#1CB5E0" />
      </Indicator>
    )
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={StyleSheet.absoluteFill, {flex: 1, backgroundColor: opacity}} >
      <LayerTop background={opacity}>
        {!scanned &&
          <AlertText color={'#ff870f'} fontSize={16} fontWeight={'normal'} textAlign={'center'} marginTop={0}
            background={'#142541'} padding={10}>Aponte o leitor para o QRCode</AlertText>
        }
      </LayerTop>
      <LayerCenter>
        <LayerLeft background={opacity} />
        <Focused />
        <LayerRight background={opacity} />
      </LayerCenter>
      <LayerBottom background={opacity}>
        {scanned &&
          <ResetButton background={'#142541'} marginTop={125} padding={0}
            onPress={() => setScanned(false)}>
            <TextContent color={'#ff870f'} fontSize={16} fontWeight={'normal'} textAlign={'center'}
              padding={10}>Ler novamente</TextContent>
          </ResetButton>
        }
      </LayerBottom>
    </BarCodeScanner>
  )
}