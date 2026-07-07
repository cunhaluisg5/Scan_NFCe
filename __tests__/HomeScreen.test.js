import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { HomeScreen } from '../src/screens/HomeScreen';
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

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: { id: 'user-1', name: 'Luis Cunha' },
    });
  });

  it('lista notas agrupadas por estabelecimento e abre o detalhamento', async () => {
    api.get.mockResolvedValue({
      nfces: [
        { socialName: 'Bahamas', totalValue: '10.50', items: [], issuanceDate: '01/07/2026 10:00:00' },
        { socialName: 'Bahamas', totalValue: '5.00', items: [], issuanceDate: '02/07/2026 11:00:00' },
      ],
    });

    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<HomeScreen navigation={navigation} />);

    await waitFor(() => {
      expect(getByText('Bahamas'.toUpperCase())).toBeTruthy();
    });

    fireEvent.press(getByText('Bahamas'.toUpperCase()));

    expect(navigation.navigate).toHaveBeenCalledWith(
      ROUTES.APP.NOTES_BY_STORE,
      expect.objectContaining({ title: 'Bahamas' })
    );
  });
});
