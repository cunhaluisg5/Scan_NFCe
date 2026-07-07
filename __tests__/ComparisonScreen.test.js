import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { ComparisonScreen } from '../src/screens/ComparisonScreen';
import { useAuth } from '../src/context/AuthContext';
import { api } from '../src/services/Api';

jest.mock('../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../src/services/Api', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('../src/components/ui', () => {
  const actual = jest.requireActual('../src/components/ui');
  const React = require('react');
  const { Pressable, Text, View } = require('react-native');

  return {
    ...actual,
    SelectModal: ({ visible, title, options, onSelect, onClose }) => (
      visible ? (
        <View>
          <Text>{title}</Text>
          {options.map((option) => (
            <Pressable key={option.value} onPress={() => onSelect(option.value)}>
              <Text>{option.label}</Text>
            </Pressable>
          ))}
          <Pressable onPress={onClose}>
            <Text>Fechar</Text>
          </Pressable>
        </View>
      ) : null
    ),
  };
});

describe('ComparisonScreen', () => {
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

  it('permite selecionar mes e item para comparar produtos', async () => {
    api.get.mockResolvedValue({
      nfces: [
        {
          id: 'nfce-1',
          socialName: 'Bahamas',
          totalValue: '87.43',
          icmsValue: '4.00',
          issuanceDate: '01/07/2026 15:18:57',
          createdAt: '2026-07-01T15:20:00.000Z',
          items: [
            { itemName: 'Leite', itemCode: '1', itemValue: '10.50' },
            { itemName: 'Cafe', itemCode: '2', itemValue: '15.00' },
          ],
        },
      ],
    });

    const { getByText } = render(<ComparisonScreen />);

    await waitFor(() => {
      expect(getByText('Selecionar mes')).toBeTruthy();
    });

    fireEvent.press(getByText('Selecionar mes'));
    fireEvent.press(getByText('Julho'));

    await waitFor(() => {
      expect(getByText('Selecionar item')).toBeTruthy();
    });

    fireEvent.press(getByText('Selecionar item'));
    fireEvent.press(getByText('Leite'));

    await waitFor(() => {
      expect(getByText('BAHAMAS')).toBeTruthy();
    });

    expect(getByText('Valor: R$ 10,50')).toBeTruthy();
  });
});
