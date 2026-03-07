import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { applyYupValidation } from '../../utils/validation';

const schema = yup.object({
  current_password: yup.string().required('Current password is required'),
  password: yup.string().min(8, 'Min 8 characters').required('New password is required'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm password'),
});

type PasswordForm = yup.InferType<typeof schema>;

const ChangePasswordScreen = () => {
  const { control, handleSubmit, setError, reset } = useForm<PasswordForm>({
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });
  const { changePassword, loading, error } = useAuth();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const onSubmit = handleSubmit(async values => {
    const isValid = await applyYupValidation(schema, values, setError);
    if (!isValid) {
      return;
    }

    const result = await changePassword(
      values.current_password,
      values.password,
      values.password_confirmation,
    );
    if ((result as { meta?: { requestStatus?: string } }).meta?.requestStatus === 'fulfilled') {
      reset();
    }
    setSnackbarVisible(true);
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Controller
        control={control}
        name="current_password"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Current Password"
            mode="outlined"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            style={styles.input}
            error={!!fieldState.error}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="New Password"
            mode="outlined"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            style={styles.input}
            error={!!fieldState.error}
          />
        )}
      />
      <Controller
        control={control}
        name="password_confirmation"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Confirm New Password"
            mode="outlined"
            secureTextEntry
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            style={styles.input}
            error={!!fieldState.error}
          />
        )}
      />

      <Button mode="contained" loading={loading} onPress={onSubmit}>
        Update Password
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}>
        {error ?? 'Password changed successfully.'}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
});

export default ChangePasswordScreen;

