import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from '../../store';
import { selectUnreadNotificationCount } from '../../store/notificationSlice';
import Badge from '../Badge';

interface NotificationBellProps {
  onPress: () => void;
}

const NotificationBell = ({ onPress }: NotificationBellProps) => {
  const unreadCount = useAppSelector(selectUnreadNotificationCount);

  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.button}>
      <Ionicons name="notifications-outline" size={24} color="#0F172A" />
      <View style={styles.badgeWrap}>
        <Badge count={unreadCount} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  badgeWrap: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
});

export default React.memo(NotificationBell);
