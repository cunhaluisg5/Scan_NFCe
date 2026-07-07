import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { AuthScreen } from '../src/screens/AuthScreen';
import { useAuth } from '../src/context/AuthContext';
import { ROUTES } from '../src/navigation/routeNames';

jest.mock('../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('AuthScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      authMessage: '',
      clearAuthMessage: jest.fn(),
      signIn: jest.fn().mockResolvedValue({ id: 'user-1' }),
      signUp: jest.fn().mockResolvedValue({ id: 'user-1' }),
    });
  });

  it('realiza login com credenciais validas', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getAllByText } = render(<AuthScreen navigation={navigation} />);

    fireEvent.changeText(getByPlaceholderText('voce@email.com'), 'teste@email.com');
    fireEvent.changeText(getByPlaceholderText('Minimo de 6 caracteres'), '123456');
    fireEvent.press(getAllByText('Entrar')[1]);

    await waitFor(() => {
      expect(useAuth().signIn).toHaveBeenCalledWith('teste@email.com', '123456');
    });
  });

  it('permite abrir cadastro e registrar nova conta', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText, queryByText } = render(<AuthScreen navigation={navigation} />);

    fireEvent.press(getByText('Criar uma conta'));

    expect(queryByText('Nova conta')).toBeTruthy();

    fireEvent.changeText(getByPlaceholderText('Seu nome'), 'Luis');
    fireEvent.changeText(getByPlaceholderText('voce@email.com'), 'novo@email.com');
    fireEvent.changeText(getByPlaceholderText('Minimo de 6 caracteres'), '123456');
    fireEvent.changeText(getByPlaceholderText('Repita a senha'), '123456');
    fireEvent.press(getByText('Registrar'));

    await waitFor(() => {
      expect(useAuth().signUp).toHaveBeenCalledWith({
        name: 'Luis',
        email: 'novo@email.com',
        password: '123456',
      });
    });

    await waitFor(() => {
      expect(getByText('Conta criada')).toBeTruthy();
    });
  });

  it('abre fluxo de recuperacao de senha com o e-mail preenchido', () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(<AuthScreen navigation={navigation} />);

    fireEvent.changeText(getByPlaceholderText('voce@email.com'), 'recuperar@email.com');
    fireEvent.press(getByText('Esqueceu sua senha?'));

    expect(navigation.navigate).toHaveBeenCalledWith(ROUTES.AUTH.FORGOT_PASSWORD, {
      email: 'recuperar@email.com',
    });
  });
});
