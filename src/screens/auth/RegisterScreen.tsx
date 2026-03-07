import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as yup from 'yup';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../hooks/useAuth';
import { applyYupValidation } from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  zip: yup.string().required('Zip is required'),
  password: yup.string().min(8, 'Min 8 characters').required('Password is required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
});

type RegisterForm = yup.InferType<typeof schema>;

const RegisterScreen = ({ navigation }: Props) => {
  const { control, handleSubmit, setError } = useForm<RegisterForm>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zip: '',
      password: '',
      password_confirmation: '',
    },
  });

  const { register, loading, error } = useAuth();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const onSubmit = handleSubmit(async values => {
    const isValid = await applyYupValidation(schema, values, setError);
    if (!isValid) {
      return;
    }

    const result = await register(
      values.name,
      values.email,
      values.phone,
      values.address,
      values.zip,
      values.city,
      values.password,
      values.password_confirmation,
    );

    if ((result as { meta?: { requestStatus?: string } }).meta?.requestStatus === 'rejected') {
      setSnackbarVisible(true);
    }
  });

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.container}>
        <Text variant="headlineMedium">Create Account</Text>
        <Text style={styles.subtitle}>Register to start tracking tasks.</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <TextInput
              label="Name"
              mode="outlined"
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!fieldState.error}
            />
          )}
        />
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
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <TextInput
              label="Phone"
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!fieldState.error}
            />
          )}
        />
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <TextInput
              label="Address"
              mode="outlined"
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!fieldState.error}
            />
          )}
        />
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <TextInput
              label="City"
              mode="outlined"
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!fieldState.error}
            />
          )}
        />
        <Controller
          control={control}
          name="zip"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <TextInput
              label="Zip"
              mode="outlined"
              keyboardType="number-pad"
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!fieldState.error}
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
        <Controller
          control={control}
          name="password_confirmation"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <TextInput
              label="Confirm Password"
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
          Register
        </Button>
        <Button onPress={() => navigation.navigate('Login')}>Already have an account?</Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}>
        {error ?? 'Registration failed.'}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
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

export default RegisterScreen;
