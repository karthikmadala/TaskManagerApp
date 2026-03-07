import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Badge } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchNotifications } from '../store/notificationSlice';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showNotificationAction?: boolean;
  actionIcon?: string;
  onActionPress?: () => void;
}

const Header = ({
  title,
  showBack = false,
  onBackPress,
  showNotificationAction = true,
  actionIcon,
  onActionPress,
}: HeaderProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const token = useAppSelector(state => state.auth.token);
  const unreadCount = useAppSelector(
    state => state.notifications.items.filter(item => !item.read_at).length,
  );

  React.useEffect(() => {
    if (!token) {
      return;
    }

    dispatch(fetchNotifications({ page: 1, refresh: true }));
    const timer = setInterval(() => {
      dispatch(fetchNotifications({ page: 1, refresh: true }));
    }, 30000);

    return () => clearInterval(timer);
  }, [dispatch, token]);

  return (
    <Appbar.Header elevated>
      {showBack ? <Appbar.BackAction onPress={onBackPress} /> : null}
      <Appbar.Content title={title} />
      {actionIcon ? <Appbar.Action icon={actionIcon} onPress={onActionPress} /> : null}
      {showNotificationAction ? (
        <View style={styles.badgeWrap}>
          <Appbar.Action
            icon="bell-ring-outline"
            onPress={() => navigation.navigate('Notifications' as never)}
          />
          {unreadCount > 0 ? (
            <Badge size={16} style={styles.badge}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          ) : null}
        </View>
      ) : null}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  badgeWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default Header;
