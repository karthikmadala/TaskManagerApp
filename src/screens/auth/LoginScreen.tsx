import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as yup from 'yup';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../hooks/useAuth';
import { applyYupValidation } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type LoginForm = yup.InferType<typeof schema>;

const LoginScreen = ({ navigation }: Props) => {
  const { control, handleSubmit, setError } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });
  const { login, loading, error } = useAuth();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const onSubmit = handleSubmit(async values => {
    const isValid = await applyYupValidation(schema, values, setError);
    if (!isValid) {
      return;
    }

    const result = await login(values.email, values.password);
    if ((result as { meta?: { requestStatus?: string } }).meta?.requestStatus === 'rejected') {
      setSnackbarVisible(true);
    }
  });

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue managing your tasks.</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!fieldState.error}
            right={fieldState.error ? <TextInput.Icon icon="alert-circle" /> : null}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={!!fieldState.error}
          />
        )}
      />

      <Button mode="contained" onPress={onSubmit} loading={loading}>
        Login
      </Button>

      <Button onPress={() => navigation.navigate('Register')}>Create Account</Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}>
        {error ?? 'Login failed.'}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    opacity: 0.75,
  },
  input: {
    marginBottom: 12,
  },
});

export default LoginScreen;
