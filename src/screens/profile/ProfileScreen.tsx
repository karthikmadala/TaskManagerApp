import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as yup from 'yup';
import { ProfileStackParamList } from '../../navigation/MainNavigator';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../store';
import { fetchProfile } from '../../store/authSlice';
import { applyYupValidation } from '../../utils/validation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  zip: yup.string().optional(),
  city: yup.string().optional(),
});

type ProfileForm = yup.InferType<typeof schema>;

const ProfileScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { user, loading, error, updateProfile, logout } = useAuth();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { control, handleSubmit, setValue, setError } = useForm<ProfileForm>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      zip: '',
      city: '',
    },
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone ?? '');
      setValue('address', user.address ?? '');
      setValue('zip', user.zip ?? '');
      setValue('city', user.city ?? '');
    }
  }, [setValue, user]);

  const onSubmit = handleSubmit(async values => {
    const isValid = await applyYupValidation(schema, values, setError);
    if (!isValid) {
      return;
    }

    const result = await updateProfile(
      values.name,
      values.email,
      values.phone,
      values.address,
      values.zip,
      values.city,
    );
    if (
      (result as { meta?: { requestStatus?: string } }).meta?.requestStatus ===
      'rejected'
    ) {
      setSnackbarVisible(true);
      return;
    }
    setSnackbarVisible(true);
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title} variant="titleLarge">
        Manage Account
      </Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Name"
            mode="outlined"
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
        name="email"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Email"
            mode="outlined"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
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
            value={value || ''}
            onBlur={onBlur}
            onChangeText={onChange}
            style={styles.input}
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
            value={value || ''}
            onBlur={onBlur}
            onChangeText={onChange}
            style={styles.input}
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
            value={value || ''}
            onBlur={onBlur}
            onChangeText={onChange}
            style={styles.input}
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
            value={value || ''}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="number-pad"
            style={styles.input}
            error={!!fieldState.error}
          />
        )}
      />

      <Button mode="contained" loading={loading} onPress={onSubmit}>
        Save Profile
      </Button>
      <Button onPress={() => navigation.navigate('ChangePassword')}>
        Change Password
      </Button>
      <Button mode="outlined" onPress={() => logout()}>
        Logout
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
      >
        {error ?? 'Profile updated.'}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginVertical: 16,
  },
  input: {
    marginBottom: 12,
  },
});

export default ProfileScreen;
