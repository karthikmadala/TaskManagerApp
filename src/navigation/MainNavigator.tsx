import React from 'react';
import { Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { getHeaderTitle } from '@react-navigation/elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppHeader from '../components/AppHeader';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';
import CreateTaskScreen from '../screens/tasks/CreateTaskScreen';
import EditTaskScreen from '../screens/tasks/EditTaskScreen';
import NotificationScreen from '../screens/notifications/NotificationScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';

export type TaskStackParamList = {
  TaskList:
    | {
        filter?: 'all' | 'completed' | 'pending' | 'overdue' | 'open';
        title?: string;
      }
    | undefined;
  TaskDetail: { taskId: number };
  CreateTask: undefined;
  EditTask: { taskId: number };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  ChangePassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tasks: NavigatorScreenParams<TaskStackParamList> | undefined;
  Profile: undefined;
};

type DashboardStackParamList = {
  DashboardHome: undefined;
};

type MainRootStackParamList = {
  Tabs: undefined;
  Notifications: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const TaskStack = createNativeStackNavigator<TaskStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const RootStack = createNativeStackNavigator<MainRootStackParamList>();

const AnimatedTabIcon = ({
  name,
  size,
  color,
  focused,
}: {
  name: string;
  size: number;
  color: string;
  focused: boolean;
}) => {
  const scale = React.useRef(new Animated.Value(focused ? 1.1 : 1)).current;

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.1 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

const dashboardTabIcon = ({
  color,
  size,
  focused,
}: {
  color: string;
  size: number;
  focused: boolean;
}) => (
  <AnimatedTabIcon name="grid-outline" size={size} color={color} focused={focused} />
);

const tasksTabIcon = ({
  color,
  size,
  focused,
}: {
  color: string;
  size: number;
  focused: boolean;
}) => (
  <AnimatedTabIcon
    name="checkmark-done-outline"
    size={size}
    color={color}
    focused={focused}
  />
);

const profileTabIcon = ({
  color,
  size,
  focused,
}: {
  color: string;
  size: number;
  focused: boolean;
}) => (
  <AnimatedTabIcon name="person-outline" size={size} color={color} focused={focused} />
);

const renderGlobalHeader = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const title = getHeaderTitle(options, route.name);

  const onNotificationPress = () => {
    const parent = navigation.getParent();
    const routeNames = parent?.getState().routeNames ?? [];
    if (routeNames.includes('Notifications')) {
      parent?.navigate('Notifications' as never);
      return;
    }

    navigation.navigate('Notifications' as never);
  };

  return (
    <AppHeader
      title={title}
      canGoBack={!!back}
      onBackPress={navigation.goBack}
      onNotificationPress={onNotificationPress}
    />
  );
};

const TaskStackNavigator = () => (
  <TaskStack.Navigator screenOptions={{ header: renderGlobalHeader }}>
    <TaskStack.Screen
      name="TaskList"
      component={TaskListScreen}
      options={({ route }) => ({ title: route.params?.title ?? 'Tasks' })}
    />
    <TaskStack.Screen
      name="TaskDetail"
      component={TaskDetailScreen}
      options={{ title: 'Task Details' }}
    />
    <TaskStack.Screen
      name="CreateTask"
      component={CreateTaskScreen}
      options={{ title: 'Create Task' }}
    />
    <TaskStack.Screen
      name="EditTask"
      component={EditTaskScreen}
      options={{ title: 'Edit Task' }}
    />
  </TaskStack.Navigator>
);

const DashboardStackNavigator = () => (
  <DashboardStack.Navigator screenOptions={{ header: renderGlobalHeader }}>
    <DashboardStack.Screen
      name="DashboardHome"
      component={DashboardScreen}
      options={{ title: 'Dashboard' }}
    />
  </DashboardStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ header: renderGlobalHeader }}>
    <ProfileStack.Screen
      name="ProfileHome"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
    <ProfileStack.Screen
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{ title: 'Change Password' }}
    />
  </ProfileStack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 66,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardStackNavigator}
        options={{ tabBarIcon: dashboardTabIcon }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskStackNavigator}
        options={{ tabBarIcon: tasksTabIcon }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ tabBarIcon: profileTabIcon }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <RootStack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{ title: 'Notifications', header: renderGlobalHeader }}
      />
    </RootStack.Navigator>
  );
};

export default MainNavigator;
