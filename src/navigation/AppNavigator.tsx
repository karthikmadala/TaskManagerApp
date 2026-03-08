import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/auth/SplashScreen';
import { useAppDispatch, useAppSelector, store } from '../store';
import { bootstrapAuth, forceLogout } from '../store/authSlice';
import { setUnauthorizedHandler } from '../api/axios';
import { fetchNotifications } from '../store/notificationSlice';

const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { token, isChecking } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      store.dispatch(forceLogout());
    });
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    dispatch(fetchNotifications({ page: 1, refresh: true }));
    const timer = setInterval(() => {
      dispatch(fetchNotifications({ page: 1, refresh: true }));
    }, 30000);

    return () => clearInterval(timer);
  }, [dispatch, token]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

