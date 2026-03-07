import { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import * as yup from 'yup';

export const applyYupValidation = async <T extends FieldValues>(
  schema: yup.ObjectSchema<T>,
  values: T,
  setError: UseFormSetError<T>,
): Promise<boolean> => {
  try {
    await schema.validate(values, { abortEarly: false });
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      error.inner.forEach(item => {
        if (item.path) {
          setError(item.path as Path<T>, { message: item.message });
        }
      });
    }
    return false;
  }
};

