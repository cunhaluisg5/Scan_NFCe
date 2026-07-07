import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { ForgotPasswordScreen } from '../src/screens/ForgotPasswordScreen';
import { api } from '../src/services/Api';

jest.mock('../src/services/Api', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('ForgotPasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('envia o e-mail de recuperacao com sucesso', async () => {
    api.post.mockResolvedValue({});

    const navigation = { goBack: jest.fn() };
    const route = { params: {} };
    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordScreen navigation={navigation} route={route} />
    );

    fireEvent.changeText(getByPlaceholderText('voce@email.com'), 'reset@email.com');
    fireEvent.press(getByText('Enviar'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/auth/forgot_password',
        { email: 'reset@email.com' },
        { auth: false }
      );
    });

    await waitFor(() => {
      expect(getByText('E-mail enviado')).toBeTruthy();
    });
  });
});
