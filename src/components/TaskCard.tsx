import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onView: () => void;
  onComplete: () => void;
}

const TaskCard = ({ task, onView, onComplete }: TaskCardProps) => {
  const completed = task.is_completed || task.status === 'completed';

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <Ionicons
              name={completed ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={completed ? '#1D9A6C' : '#5B667A'}
            />
            <Text variant="titleMedium" style={styles.title}>
              {task.title}
            </Text>
          </View>
          <Chip compact style={completed ? styles.doneChip : styles.pendingChip}>
            {completed ? 'Completed' : 'Pending'}
          </Chip>
        </View>
        {task.description ? (
          <Text style={styles.description} variant="bodyMedium">
            {task.description}
          </Text>
        ) : null}
        {task.due_date ? (
          <View style={styles.dueRow}>
            <Ionicons name="calendar-outline" size={14} color="#5B667A" />
            <Text variant="bodySmall">Due: {task.due_date}</Text>
          </View>
        ) : null}
      </Card.Content>
      <Card.Actions>
        <Button onPress={onView}>Details</Button>
        {!completed ? (
          <Button mode="contained-tonal" onPress={onComplete}>
            Complete
          </Button>
        ) : null}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    flexShrink: 1,
  },
  pendingChip: {
    backgroundColor: '#EEF2FF',
  },
  doneChip: {
    backgroundColor: '#E9F9F2',
  },
  description: {
    marginTop: 8,
    marginBottom: 10,
    opacity: 0.9,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export default TaskCard;
