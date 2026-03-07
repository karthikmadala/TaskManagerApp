import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Snackbar, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Loader from '../../components/Loader';
import { TaskStackParamList } from '../../navigation/MainNavigator';
import { useAppDispatch, useAppSelector } from '../../store';
import { deleteTask, fetchTaskById } from '../../store/taskSlice';

type Props = NativeStackScreenProps<TaskStackParamList, 'TaskDetail'>;

const TaskDetailScreen = ({ route, navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { selectedTask, loading, error } = useAppSelector(state => state.tasks);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchTaskById(route.params.taskId));
  }, [dispatch, route.params.taskId]);

  useEffect(() => {
    if (error) {
      setSnackbarVisible(true);
    }
  }, [error]);

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await dispatch(deleteTask(route.params.taskId));
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading || !selectedTask) {
    return <Loader />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Content>
          <Text variant="headlineSmall">{selectedTask.title}</Text>
          <Text style={styles.fieldLabel}>Description</Text>
          <Text>{selectedTask.description || 'No description'}</Text>
          <Text style={styles.fieldLabel}>Due Date</Text>
          <Text>{selectedTask.due_date || 'Not set'}</Text>
          <Text style={styles.fieldLabel}>Status</Text>
          <Text>
            {selectedTask.is_completed || selectedTask.status === 'completed'
              ? 'Completed'
              : 'Pending'}
          </Text>
        </Card.Content>
      </Card>
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('EditTask', { taskId: selectedTask.id })}>
          Edit Task
        </Button>
        <Button mode="outlined" onPress={handleDelete}>
          Delete Task
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}>
        {error ?? 'Something went wrong.'}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  fieldLabel: {
    marginTop: 16,
    marginBottom: 4,
    opacity: 0.75,
  },
  actions: {
    gap: 10,
  },
});

export default TaskDetailScreen;

