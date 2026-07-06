import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { api, setAuthFailureHandler } from '../services/Api';
import { clearSession, getSession, saveSession, updateStoredUser } from '../storage/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [user, setUser] = useState(null);
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const session = await getSession();
        if (!active) {
          return;
        }

        if (session.token && session.user) {
          setUser(session.user);
          setStatus('authenticated');
        } else {
          await clearSession();
          setStatus('unauthenticated');
        }
      } catch (error) {
        await clearSession();
        setStatus('unauthenticated');
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setAuthFailureHandler(async (error) => {
      setUser(null);
      setStatus('unauthenticated');
      setAuthMessage(error?.message || 'Sua sessao expirou. Entre novamente.');
    });

    return () => {
      setAuthFailureHandler(null);
    };
  }, []);

  const value = useMemo(() => ({
    status,
    user,
    authMessage,
    async signIn(email, password) {
      const response = await api.post('/auth/authenticate', { email, password }, { auth: false });
      await saveSession(response);
      setUser(response.user);
      setAuthMessage('');
      setStatus('authenticated');
      return response.user;
    },
    async signUp(payload) {
      const response = await api.post('/auth/register', payload, { auth: false });
      return response.user;
    },
    async signOut() {
      await clearSession();
      setUser(null);
      setAuthMessage('');
      setStatus('unauthenticated');
    },
    async updateName(name) {
      const response = await api.put(`/auth/${user._id || user.id}`, { name });
      await updateStoredUser(response.user);
      setUser(response.user);
      return response.user;
    },
    async refreshUserFromStorage() {
      const session = await getSession();
      setUser(session.user);
      return session.user;
    },
    clearAuthMessage() {
      setAuthMessage('');
    },
  }), [authMessage, status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
