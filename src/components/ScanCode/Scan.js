import React, { useState, useEffect } from 'react';
import { StyleSheet, Vibration, Alert, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { Content, Text, Button, Indicator } from './Style';
import Api from '../../services/Api'

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
      <Text fontSize={16} fontWeight={'normal '} marginTop={30} > Solicitando permissão da câmera. </Text>);
  }
  if (hasPermission === false) {
    return (
      <Text fontSize={16} fontWeight={'normal'} marginTop={30} > Sem acesso à câmera. </Text>);
  }

  const validateURL = (url) => {
    if((url.search(/nfce.fazenda.mg.gov.br/i) !== -1) && (url.length === 156)) {
      return true;
    }
    return false;
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
        }
        props.navigate('Detalhes da NFCe', { item: item, isRecord: true, da: response.data });
        setIsLoading(false);
      } catch (err) {
        console.log('Erro ', err)
      }
    }
  };

  const typeData = (type) => {
    switch (type) {
      case 1: case 2: case 8: case 32: case 512: case 1024:
        return 'Código de Barras'
      case 256:
        return 'QRCode'
      default:
        return 'Indefinido'
    }
  }

  if (isLoading) {
    return (
      <Indicator>
        <ActivityIndicator size="large" color="#1CB5E0" />
      </Indicator>
    )
  }

  return (
    <Content justifyContent={'center'} alignItems={'center'} padding={0}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFill} />
      {scanned &&
        <Button background={'#A9A9A9'} marginTop={530} padding={10}
          onPress={() => setScanned(false)}>
          <Text color={'white'} fontSize={20} fontWeight={'normal'} > Ler novamente </Text>
        </Button>}
    </Content>
  )
}