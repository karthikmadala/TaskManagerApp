import React, { useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchNotifications, markNotificationRead } from '../../store/notificationSlice';
import { NotificationItem } from '../../types';

const NotificationScreen = () => {
  const dispatch = useAppDispatch();
  const { items, loading, refreshing, page, hasMore } = useAppSelector(
    state => state.notifications,
  );

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1 }));
  }, [dispatch]);

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <Card style={[styles.card, !item.read_at ? styles.unreadCard : null]}>
      <Card.Content>
        <View style={styles.titleRow}>
          <Ionicons
            name={!item.read_at ? 'notifications' : 'notifications-outline'}
            size={18}
            color={!item.read_at ? '#FF6B35' : '#4A5568'}
          />
          <Text variant="titleMedium" style={styles.title}>
            {item.title}
          </Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
        <Text variant="bodySmall">{item.created_at ?? ''}</Text>
      </Card.Content>
      {!item.read_at ? (
        <Card.Actions>
          <Button onPress={() => dispatch(markNotificationRead(item.id))}>
            Mark as read
          </Button>
        </Card.Actions>
      ) : null}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Notifications" showNotificationAction={false} />
      {loading && items.length === 0 ? (
        <Loader variant="skeleton" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => dispatch(fetchNotifications({ page: 1, refresh: true }))}
            />
          }
          ListFooterComponent={
            hasMore ? (
              <Button
                mode="contained-tonal"
                style={styles.loadMore}
                onPress={() => dispatch(fetchNotifications({ page: page + 1 }))}>
                Load More
              </Button>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState title="No notifications" subtitle="You are all caught up." />
          }
          contentContainerStyle={styles.content}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FF',
  },
  content: {
    paddingBottom: 24,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    textTransform: 'capitalize',
  },
  message: {
    marginVertical: 8,
    opacity: 0.9,
    color: '#1F2937',
  },
  loadMore: {
    marginTop: 16,
    marginHorizontal: 16,
  },
});

export default NotificationScreen;
