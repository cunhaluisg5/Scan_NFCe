import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { SpendingScreen } from '../src/screens/SpendingScreen';
import { useAuth } from '../src/context/AuthContext';
import { api } from '../src/services/Api';
import { ROUTES } from '../src/navigation/routeNames';

jest.mock('../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../src/services/Api', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('../src/components/SimpleLineChart', () => ({
  SimpleLineChart: ({ labels, values }) => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return (
      <View>
        <Text>{`labels:${labels.join(',')}`}</Text>
        <Text>{`values:${values.join(',')}`}</Text>
      </View>
    );
  },
}));

describe('SpendingScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-10T12:00:00.000Z'));
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: { id: 'user-1' },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('carrega analise de gastos e abre a nota de maior impacto', async () => {
    api.get.mockResolvedValue({
      nfces: [
        {
          id: 'nfce-1',
          socialName: 'Bahamas',
          totalValue: '87.43',
          issuanceDate: '01/07/2026 15:18:57',
          uf: 'MG',
          cnpj: '12345678000199',
          items: [],
        },
      ],
    });

    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<SpendingScreen navigation={navigation} />);

    await waitFor(() => {
      expect(getByText('Linha de gastos')).toBeTruthy();
    });

    fireEvent.press(getByText('BAHAMAS'));

    expect(navigation.navigate).toHaveBeenCalledWith(
      ROUTES.APP.INVOICE_DETAILS,
      expect.objectContaining({ mode: 'saved' })
    );
  });
});
