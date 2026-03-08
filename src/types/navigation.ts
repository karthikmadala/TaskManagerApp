import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export type TaskStackParamList = {
  TaskList: {
    filter?: 'all' | 'completed' | 'pending' | 'overdue' | 'open';
    title?: string;
  } | undefined;
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

export type MainRootStackParamList = {
  Tabs: undefined;
  Notifications: undefined;
};

// Global typing for useNavigation and useRoute
declare global {
  namespace ReactNavigation {
    interface RootParamList
      extends MainRootStackParamList,
        AuthStackParamList,
        MainTabParamList,
        TaskStackParamList,
        ProfileStackParamList {}
  }
}
