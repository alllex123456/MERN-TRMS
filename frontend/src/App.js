import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { MainLayout } from './components/layout/MainLayout';
import { QueuePage } from './pages/queue';
import { ClientsPage } from './pages/clients';
import { StatementsPage } from './pages/statements';
import { ClientStatementPage } from './pages/clientStatement';
import { MetricsPage } from './pages/metrics';
import { ProfilePage } from './pages/profile';
import { SettingsPage } from './pages/settings';
import { DashboardMain } from './pages/dashboard.js';

import { AuthContext } from './context/auth-context';

import Auth from './components/auth/Auth';
import LoadingSpinner from './components/COMMON/UIElements/LoadingSpinner';
import { ResetPassword } from './pages/resetPassword';
import { useHttpClient } from './hooks/useHttpClient';
import { InvoicingPage } from './pages/invoicing';
import { ClientInvoicingPage } from './pages/clientInvoicing';
import { translateServices, translateUnits } from './utilities/translate-units';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_APP_DATA':
      const units = translateUnits(action.appData.units);

      const services = translateServices(action.appData.services);

      return {
        ...state,
        currencies: action.appData.currencies,
        units,
        languages: action.appData.languages,
        themes: action.appData.themes,
        services,
      };

    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: !!action.token,
        token: action.token,
        tokenExpirationDate: action.tokenExpirationDate,
        userId: action.user._id,
        userAlias: action.user.alias,
        preferredCurrency: action.user.preferredCurrency,
        avatar: action.user.avatar,
        theme: action.user.theme,
        language: action.user.language,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        tokenExpirationDate: null,
        userId: null,
        userAlias: null,
        units: [],
        avatar: '',
        theme: '',
        themes: [],
        language: '',
        services: [],
        preferredCurrency: '',
      };

    case 'CHANGE_ITEM':
      return {
        ...state,
        [action.key]: action.item,
      };

    default:
      return state;
  }
};

function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userState, dispatch] = useReducer(userReducer, {
    isLoggedIn: false,
    token: null,
    tokenExpirationDate: null,
    userId: '',
    userAlias: '',
    avatar: '',
    theme: '',
    themes: [],
    language: '',
    languages: [],
    preferredCurrency: '',
    currencies: [],
    units: [],
    services: [],
  });
  const { sendRequest, isLoading, error, clearError } = useHttpClient();

  let logoutTimer;

  const navigator = useNavigate();

  const changeContextItem = (key, item) => {
    dispatch({ type: 'CHANGE_ITEM', key, item });
    const localUserData = JSON.parse(localStorage.getItem('userData'));
    localUserData.user[key] = item;
    localStorage.setItem('userData', JSON.stringify({ ...localUserData }));
  };

  const login = useCallback(
    async (token, user, expirationDate) => {
      const tokenExpirationDate =
        new Date(expirationDate).getTime() || Date.now() + 1000 * 60 * 60 * 24;
      dispatch({
        type: 'LOGIN',
        token,
        tokenExpirationDate,
        user,
      });

      const getAppData = async () => {
        try {
          const responseData = await sendRequest(
            'http://localhost:8000/app/app-settings'
          );

          dispatch({ type: 'SET_APP_DATA', appData: responseData.message });

          localStorage.setItem(
            'appData',
            JSON.stringify({
              responseData,
            })
          );
        } catch (error) {}
      };
      getAppData();

      localStorage.setItem(
        'userData',
        JSON.stringify({
          token,
          tokenExpirationDate,
          user,
        })
      );
    },
    [sendRequest]
  );

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    navigator('/', { replace: true });
    localStorage.removeItem('userData');
    localStorage.removeItem('appData');
  }, [navigator]);

  useEffect(() => {
    if (userState.token && userState.tokenExpirationDate) {
      const remainingTime = userState.tokenExpirationDate - Date.now();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [userState.token, logout, userState.tokenExpirationDate]);

  useEffect(() => {
    const localUserData = JSON.parse(localStorage.getItem('userData'));

    if (
      localUserData &&
      localUserData.token &&
      localUserData.tokenExpirationDate > Date.now()
    ) {
      const { token, user } = localUserData;
      login(token, user, localUserData.tokenExpirationDate);
    }
    setCheckingAuth(false);
  }, [login]);

  useEffect(() => {
    const getAppData = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:8000/app/app-settings'
        );

        dispatch({ type: 'SET_APP_DATA', appData: responseData.message });

        localStorage.setItem(
          'appData',
          JSON.stringify({
            responseData,
          })
        );
      } catch (error) {}
    };
    getAppData();
  }, [sendRequest]);

  if (checkingAuth) {
    return <LoadingSpinner asOverlay />;
  }

  if (!userState.isLoggedIn) {
    return (
      <AuthContext.Provider
        value={{
          currencies: userState.currencies,
          languages: userState.languages,
          login,
          logout,
        }}
      >
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Auth />} />
        </Routes>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: userState.isLoggedIn,
        token: userState.token,
        user: userState.userId,
        userAlias: userState.userAlias,
        units: userState.units,
        currencies: userState.currencies,
        avatar: userState.avatar,
        languages: userState.languages,
        language: userState.language,
        theme: userState.theme,
        themes: userState.themes,
        services: userState.services,
        preferredCurrency: userState.preferredCurrency,
        login,
        logout,
        changeContextItem,
      }}
    >
      <MainLayout>
        <Routes>
          <Route path="/main" element={<DashboardMain />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route
            path="/statements/:clientId"
            element={<ClientStatementPage />}
          />
          <Route path="/statements" element={<StatementsPage />} />
          <Route path="/invoicing" element={<InvoicingPage />} />
          <Route path="invoicing/:clientId" element={<ClientInvoicingPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<DashboardMain />} />
        </Routes>
      </MainLayout>
    </AuthContext.Provider>
  );
}

export default App;
