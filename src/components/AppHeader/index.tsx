import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Pressable } from 'react-native';
import NotificationBell from '../NotificationBell';

interface AppHeaderProps {
  title: string;
  canGoBack?: boolean;
  onBackPress?: () => void;
  onNotificationPress: () => void;
}

const AppHeader = ({
  title,
  canGoBack = false,
  onBackPress,
  onNotificationPress,
}: AppHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.inner}>
        <View style={styles.leftWrap}>
          {canGoBack ? (
            <Pressable onPress={onBackPress} hitSlop={8} style={styles.backButton}>
              <Ionicons name="chevron-back" size={22} color="#0F172A" />
            </Pressable>
          ) : null}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <NotificationBell onPress={onNotificationPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
});

export default React.memo(AppHeader);
