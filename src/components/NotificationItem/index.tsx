import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NotificationItem as NotificationItemModel } from '../../types';

interface NotificationItemProps {
  item: NotificationItemModel;
  onPress: (id: string) => void;
}

const formatTimestamp = (value?: string): string => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const NotificationItem = ({ item, onPress }: NotificationItemProps) => {
  const unread = !item.read_at;

  return (
    <Pressable
      onPress={() => onPress(item.id)}
      style={[styles.container, unread ? styles.unreadContainer : null]}>
      <View style={styles.iconWrap}>
        <Ionicons
          name={unread ? 'notifications' : 'mail-open-outline'}
          size={20}
          color={unread ? '#2563EB' : '#64748B'}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {unread ? <View style={styles.dot} /> : null}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.time}>{formatTimestamp(item.created_at)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unreadContainer: {
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FBFF',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'capitalize',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginLeft: 8,
  },
  message: {
    marginTop: 4,
    fontSize: 14,
    color: '#334155',
  },
  time: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748B',
  },
});

export default React.memo(NotificationItem);
