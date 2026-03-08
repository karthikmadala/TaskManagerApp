import React from 'react';
import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack';
import { getHeaderTitle } from '@react-navigation/elements';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AppHeader from '../components/AppHeader';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const renderAuthHeader = ({ navigation, route, options, back }: NativeStackHeaderProps) => (
  <AppHeader
    title={getHeaderTitle(options, route.name)}
    canGoBack={!!back}
    onBackPress={navigation.goBack}
    onNotificationPress={() => {}}
  />
);

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ header: renderAuthHeader }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

