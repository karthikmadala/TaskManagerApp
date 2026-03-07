import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Menu, Snackbar, TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as yup from 'yup';
import { TaskStackParamList } from '../../navigation/MainNavigator';
import { useAppDispatch, useAppSelector } from '../../store';
import { createTask } from '../../store/taskSlice';
import { applyYupValidation } from '../../utils/validation';

type Props = NativeStackScreenProps<TaskStackParamList, 'CreateTask'>;

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
  due_date: yup.string().optional(),
  priority: yup
    .string<'low' | 'medium' | 'high'>()
    .oneOf(['low', 'medium', 'high'])
    .required('Priority is required'),
  status: yup
    .string<'pending' | 'in_progress' | 'completed'>()
    .oneOf(['pending', 'in_progress', 'completed'])
    .required('Status is required'),
});

type TaskForm = yup.InferType<typeof schema>;

const CreateTaskScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { submitting, error } = useAppSelector(state => state.tasks);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const { control, handleSubmit, setError } = useForm<TaskForm>({
    defaultValues: {
      title: '',
      description: '',
      due_date: '',
      priority: 'medium',
      status: 'pending',
    },
  });

  const onSubmit = handleSubmit(async values => {
    const isValid = await applyYupValidation(schema, values, setError);
    if (!isValid) {
      return;
    }

    const result = await dispatch(createTask(values));
    if ((result as { meta?: { requestStatus?: string } }).meta?.requestStatus === 'fulfilled') {
      navigation.goBack();
      return;
    }
    setSnackbarVisible(true);
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Title"
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
        name="description"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Description"
            mode="outlined"
            multiline
            numberOfLines={4}
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
        name="due_date"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <TextInput
            label="Due Date (YYYY-MM-DD)"
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
        name="status"
        render={({ field: { onChange, value } }) => (
          <Menu
            visible={statusMenuVisible}
            onDismiss={() => setStatusMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setStatusMenuVisible(true)}
                style={styles.input}>
                {`Status: ${value ?? 'pending'}`}
              </Button>
            }>
            <Menu.Item
              onPress={() => {
                onChange('pending');
                setStatusMenuVisible(false);
              }}
              title="Pending"
            />
            <Menu.Item
              onPress={() => {
                onChange('in_progress');
                setStatusMenuVisible(false);
              }}
              title="In Progress"
            />
            <Menu.Item
              onPress={() => {
                onChange('completed');
                setStatusMenuVisible(false);
              }}
              title="Completed"
            />
          </Menu>
        )}
      />
      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <Menu
            visible={priorityMenuVisible}
            onDismiss={() => setPriorityMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setPriorityMenuVisible(true)}
                style={styles.input}>
                {`Priority: ${value ?? 'medium'}`}
              </Button>
            }>
            <Menu.Item
              onPress={() => {
                onChange('low');
                setPriorityMenuVisible(false);
              }}
              title="low"
            />
            <Menu.Item
              onPress={() => {
                onChange('medium');
                setPriorityMenuVisible(false);
              }}
              title="medium"
            />
            <Menu.Item
              onPress={() => {
                onChange('high');
                setPriorityMenuVisible(false);
              }}
              title="high"
            />
          </Menu>
        )}
      />

      <Button mode="contained" loading={submitting} onPress={onSubmit}>
        Create Task
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}>
        {error ?? 'Could not create task.'}
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

export default CreateTaskScreen;
