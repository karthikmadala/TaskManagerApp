import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, StatusBar } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store';
import { appTheme } from './src/theme/theme';

function App(): React.JSX.Element {
  useEffect(() => {
    const requestStoragePermission = async () => {
      if (Platform.OS !== 'android') {
        return;
      }

      const androidVersion = Platform.Version as number;
      const permissions =
        androidVersion >= 33
          ? [PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES]
          : [
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ];

      await PermissionsAndroid.requestMultiple(permissions);
    };

    requestStoragePermission();
  }, []);

  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={appTheme}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <AppNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}

export default App;
