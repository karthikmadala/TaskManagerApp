import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import NotificationItemCard from '../../components/NotificationItem';
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

  const handlePressItem = useCallback((id: string) => {
    dispatch(markNotificationRead(id));
  }, [dispatch]);

  const renderItem = useCallback(({ item }: { item: NotificationItem }) => (
    <NotificationItemCard item={item} onPress={handlePressItem} />
  ), [handlePressItem]);

  return (
    <View style={styles.container}>
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
  loadMore: {
    marginTop: 16,
    marginHorizontal: 16,
  },
});

export default NotificationScreen;
