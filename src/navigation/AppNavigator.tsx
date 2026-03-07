import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import Loader from '../components/Loader';
import { useAppDispatch, useAppSelector, store } from '../store';
import { bootstrapAuth, forceLogout } from '../store/authSlice';
import { setUnauthorizedHandler } from '../api/axios';

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

  if (isChecking) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

