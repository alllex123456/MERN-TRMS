import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  units: [],
  currencies: [],
  preferredCurrency: '',
  avatar: '',
  theme: '',
  themes: [],
  language: '',
  languages: [],
  login: () => {},
  logout: () => {},
  changeAvatar: () => [],
});
