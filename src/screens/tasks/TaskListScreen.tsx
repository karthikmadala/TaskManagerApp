import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  RefreshControl,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import { Button, Chip, Snackbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import TaskCard from '../../components/TaskCard';
import { TaskStackParamList } from '../../navigation/MainNavigator';
import { useAppDispatch, useAppSelector } from '../../store';
import { completeTask, fetchTasks } from '../../store/taskSlice';
import { Task } from '../../types';

type Props = NativeStackScreenProps<TaskStackParamList, 'TaskList'>;

const TaskListScreen = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const { items, loading, refreshing, page, hasMore, error } = useAppSelector(
    state => state.tasks,
  );
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const routeFilter = route.params?.filter ?? 'all';
  const [activeFilter, setActiveFilter] = useState(routeFilter);
  const statusFilter =
    activeFilter === 'completed' || activeFilter === 'pending'
      ? activeFilter
      : undefined;

  const loadTasks = useCallback(
    (targetPage = 1, refresh = false) => {
      dispatch(fetchTasks({ page: targetPage, refresh, status: statusFilter }));
    },
    [dispatch, statusFilter],
  );

  useEffect(() => {
    setActiveFilter(routeFilter);
  }, [routeFilter]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks, activeFilter]);

  useEffect(() => {
    if (error) {
      setSnackbarVisible(true);
    }
  }, [error]);

  const displayedItems = useMemo(() => {
    if (activeFilter === 'open') {
      return items.filter(item => item.status !== 'completed');
    }

    if (activeFilter === 'overdue') {
      const now = Date.now();
      return items.filter(item => {
        if (item.status === 'completed' || !item.due_date) {
          return false;
        }

        const dueDate = new Date(item.due_date).getTime();
        return Number.isFinite(dueDate) && dueDate < now;
      });
    }

    return items;
  }, [items, activeFilter]);

  const applyFilter = useCallback(
    (next: 'all' | 'completed' | 'pending' | 'overdue' | 'open') => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setActiveFilter(next);
    },
    [],
  );

  const onComplete = useCallback(
    async (taskId: number) => {
      await dispatch(completeTask(taskId));
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskCard
        task={item}
        onView={() => navigation.navigate('TaskDetail', { taskId: item.id })}
        onComplete={() => onComplete(item.id)}
      />
    ),
    [navigation, onComplete],
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbarRow}>
        <Button mode="contained" onPress={() => navigation.navigate('CreateTask')}>
          New Task
        </Button>
      </View>
      <View style={styles.filterRow}>
        <Chip selected={activeFilter === 'all'} onPress={() => applyFilter('all')}>
          All
        </Chip>
        <Chip
          selected={activeFilter === 'pending'}
          onPress={() => applyFilter('pending')}>
          Pending
        </Chip>
        <Chip
          selected={activeFilter === 'completed'}
          onPress={() => applyFilter('completed')}>
          Completed
        </Chip>
        <Chip
          selected={activeFilter === 'overdue'}
          onPress={() => applyFilter('overdue')}>
          Overdue
        </Chip>
        {/* <Chip selected={activeFilter === 'open'} onPress={() => applyFilter('open')}>
          Open
        </Chip> */}
      </View>

      {loading && displayedItems.length === 0 ? (
        <Loader variant="skeleton" />
      ) : (
        <FlatList
          data={displayedItems}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadTasks(1, true)}
            />
          }
          ListEmptyComponent={
            <EmptyState title="No tasks found" subtitle="No items match this filter." />
          }
          ListFooterComponent={
            hasMore ? (
              <Button onPress={() => loadTasks(page + 1)}>Load More</Button>
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}>
        {error ?? 'Something went wrong.'}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF3FF',
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  toolbarRow: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 2,
    alignItems: 'flex-end',
  },
});

export default TaskListScreen;
