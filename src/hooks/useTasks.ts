import { useMemo } from 'react';
import {
  completeTask,
  createTask,
  deleteTask,
  fetchTaskById,
  fetchTasks,
  updateTask,
} from '../store/taskSlice';
import { useAppDispatch, useAppSelector } from '../store';

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks);

  return useMemo(
    () => ({
      ...tasks,
      fetchTasks: (page = 1, refresh = false) =>
        dispatch(fetchTasks({ page, refresh })),
      fetchTaskById: (taskId: number) => dispatch(fetchTaskById(taskId)),
      createTask: (
        title: string,
        description?: string,
        due_date?: string | null,
        priority?: string,
      ) => dispatch(createTask({ title, description, due_date, priority })),
      updateTask: (
        taskId: number,
        title: string,
        description?: string,
        due_date?: string | null,
        priority?: string,
      ) =>
        dispatch(
          updateTask({ taskId, data: { title, description, due_date, priority } }),
        ),
      deleteTask: (taskId: number) => dispatch(deleteTask(taskId)),
      completeTask: (taskId: number) => dispatch(completeTask(taskId)),
    }),
    [dispatch, tasks],
  );
};

