import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';
import { UserTypes } from '@/utils/types';

interface AuthContextType {
  user: boolean;
  signIn: (token: string, user: UserTypes) => void;
  signOut: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserTypes;
  saveUserData(userData: UserTypes): void;
}

interface AuthProviderType {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: AuthProviderType) {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get('token');

  useEffect(() => {
    const isAuthenticated: () => boolean = () => token !== undefined;
    setUser(isAuthenticated());
    if (user || !user) setLoading(false);
  }, [token, user]);

  function saveUserData(userData: UserTypes) {
    localStorage.setItem('usuario', JSON.stringify(userData));
  }

  const userObj = localStorage.getItem('usuario');
  const userData = userObj ? JSON.parse(userObj) : null;

  const signIn = (token: string, usuario: UserTypes) => {
    setUser(true);
    saveUserData(usuario);
    Cookies.set('token', token, {
      expires: 2,
      secure: true,
      sameSite: 'None',
    });
  };

  const signOut = () => {
    setUser(false);
    Cookies.remove('token');
    localStorage.clear();
    window.location.href = '/login';
  };

  const value = {
    userData,
    saveUserData,
    user,
    loading,
    setLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
