import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Task } from '../types';
import { appTheme } from '../theme/theme';

interface TaskCardProps {
  task: Task;
  onView: () => void;
  onComplete: () => void;
}

const TaskCard = ({ task, onView, onComplete }: TaskCardProps) => {
  const completed = task.is_completed || task.status === 'completed';

  return (
    <Card style={styles.card} mode="elevated" elevation={2}>
      <Card.Content>
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <Ionicons
              name={completed ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={completed ? appTheme.colors.secondary : appTheme.colors.onSurfaceVariant}
            />
            <Text variant="titleMedium" style={[styles.title, completed && styles.titleCompleted]}>
              {task.title}
            </Text>
          </View>
          <Chip
            compact
            textStyle={styles.chipText}
            style={completed ? styles.doneChip : styles.pendingChip}>
            {completed ? 'Complete' : 'Pending'}
          </Chip>
        </View>
        {task.description ? (
          <Text style={styles.description} variant="bodyMedium" numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        {task.due_date ? (
          <View style={styles.dueRow}>
            <Ionicons name="calendar-outline" size={14} color={appTheme.colors.onSurfaceVariant} />
            <Text variant="labelMedium" style={styles.dueDateText}>Due: {task.due_date}</Text>
          </View>
        ) : null}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="text" onPress={onView} textColor={appTheme.colors.primary}>
          Details
        </Button>
        {!completed ? (
          <Button mode="contained" onPress={onComplete} style={styles.completeBtn}>
            Complete Task
          </Button>
        ) : null}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: appTheme.roundness * 1.5,
    backgroundColor: appTheme.colors.surface,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  title: {
    flexShrink: 1,
    fontWeight: '700',
    color: appTheme.colors.onSurface,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: appTheme.colors.onSurfaceVariant,
  },
  pendingChip: {
    backgroundColor: appTheme.colors.primaryContainer,
    borderRadius: 8,
  },
  doneChip: {
    backgroundColor: appTheme.colors.secondaryContainer,
    borderRadius: 8,
  },
  chipText: {
    fontWeight: '600',
    fontSize: 11,
  },
  description: {
    marginTop: 12,
    marginBottom: 14,
    color: appTheme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: appTheme.colors.surfaceVariant,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dueDateText: {
    color: appTheme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: appTheme.colors.surfaceVariant,
    paddingTop: 8,
    marginTop: 8,
    justifyContent: 'flex-end',
  },
  completeBtn: {
    borderRadius: 8,
    paddingHorizontal: 4,
  },
});

export default React.memo(TaskCard);
