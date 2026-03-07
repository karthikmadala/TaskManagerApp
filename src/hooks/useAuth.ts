import { useMemo } from 'react';
import {
  bootstrapAuth,
  login,
  logout,
  register,
  updateProfile,
  changePassword,
} from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);

  return useMemo(
    () => ({
      ...auth,
      bootstrap: () => dispatch(bootstrapAuth()),
      login: (email: string, password: string) =>
        dispatch(login({ email, password })),
      register: (
        name: string,
        email: string,
        phone: string,
        address: string,
        zip: string,
        city: string,
        password: string,
        password_confirmation: string,
      ) => dispatch(register({ name, email, phone, city, address, zip, password, password_confirmation })),
      logout: () => dispatch(logout()),
      updateProfile: (name: string, email: string, phone?: string | null, address?: string | null, zip?: string | null, city?: string | null) =>
        dispatch(updateProfile({ name, email, phone, address, zip, city })),
      changePassword: (
        current_password: string,
        password: string,
        password_confirmation: string,
      ) =>
        dispatch(
          changePassword({
            current_password,
            password,
            password_confirmation,
          }),
        ),
    }),
    [auth, dispatch],
  );
};

