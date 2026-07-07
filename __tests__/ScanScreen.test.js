import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useCameraPermissions } from 'expo-camera';

import { ScanScreen } from '../src/screens/ScanScreen';
import { api } from '../src/services/Api';
import { getAutoSavePreference } from '../src/storage/preferences';
import { ROUTES } from '../src/navigation/routeNames';

jest.mock('../src/services/Api', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('../src/storage/preferences', () => ({
  getAutoSavePreference: jest.fn(),
}));

describe('ScanScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCameraPermissions.mockReturnValue([{ granted: true }, jest.fn()]);
  });

  it('mostra erro quando o QR code nao corresponde a uma NFC-e MG valida', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByTestId, getByText } = render(<ScanScreen navigation={navigation} />);

    fireEvent(getByTestId('camera-view'), 'onBarcodeScanned', { data: 'https://google.com/qrcode' });

    await waitFor(() => {
      expect(getByText('QR Code invalido')).toBeTruthy();
    });
  });

  it('navega para os detalhes quando a leitura precisa de salvamento manual', async () => {
    api.post.mockResolvedValueOnce({
      nfce: {
        details: {
          totalItems: '1',
          totalValue: '10.50',
          paidValue: '10.50',
          typePayment: 'Cartao',
        },
        detailsNfce: {
          accesskey: '123',
          socialName: 'Bahamas',
          cnpj: '12345678000199',
          stateRegistration: '123',
          uf: 'MG',
          issuanceDate: '01/07/2026 15:18:57',
          totalValueService: '0.00',
          icmsCalculationBasis: '0.00',
          icmsValue: '0.00',
          protocol: 'abc',
          url: 'https://portalsped.fazenda.mg.gov.br/portalnfce',
        },
        items: [{ itemName: 'Leite', itemCode: '1', qtdItem: '1', unItem: 'UN', itemValue: '10.50' }],
      },
    });
    getAutoSavePreference.mockResolvedValue(false);

    const navigation = { navigate: jest.fn() };
    const { getByTestId } = render(<ScanScreen navigation={navigation} />);

    fireEvent(getByTestId('camera-view'), 'onBarcodeScanned', {
      data: 'https://portalsped.fazenda.mg.gov.br/portalnfce/some-token',
    });

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith(
        ROUTES.APP.INVOICE_DETAILS,
        expect.objectContaining({
          mode: 'draft',
          allowSaveAction: true,
        })
      );
    });
  });
});
