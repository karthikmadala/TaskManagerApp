import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../../components/Loader';
import { dashboardApi } from '../../api/dashboardApi';
import { DashboardStats } from '../../types';
import { MainTabParamList } from '../../navigation/MainNavigator';
import { appTheme } from '../../theme/theme';
const defaultStats: DashboardStats = {
  total: 0,
  completed: 0,
  pending: 0,
  overdue: 0,
  completion_rate: 0,
  open_tasks: 0,
};

const DashboardScreen = () => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await dashboardApi.getDashboard();
      setStats({ ...defaultStats, ...data });
    } catch {
      // Fallback
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [fadeAnim, loading]);

  if (loading) {
    return <Loader variant="skeleton" />;
  }

  const animatedContainerStyle = {
    opacity: fadeAnim,
    transform: [
      {
        translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [15, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.orbA} />
      <View style={styles.orbB} />

      <Animated.View style={[styles.animatedContainer, animatedContainerStyle]}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchData(true)}
            />
          }
        >
          <View style={styles.grid}>
            {/* Total Tasks */}
            <Card
              style={[styles.card, styles.cardFull]}
              mode="elevated"
              elevation={2}
            >
              <Card.Content style={styles.cardContentRow}>
                <View>
                  <Text variant="titleMedium" style={styles.cardTitle}>
                    Total Tasks
                  </Text>
                  <Text variant="displaySmall" style={styles.cardValue}>
                    {stats.total}
                  </Text>
                </View>
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: appTheme.colors.primaryContainer },
                  ]}
                >
                  <Ionicons
                    name="layers-outline"
                    size={28}
                    color={appTheme.colors.primary}
                  />
                </View>
              </Card.Content>
            </Card>

            {/* Completed */}
            <Card
              style={[styles.card, styles.cardHalf]}
              mode="elevated"
              elevation={2}
              onPress={() =>
                navigation.navigate('Tasks', {
                  screen: 'TaskList',
                  params: { filter: 'completed', title: 'Completed Tasks' },
                })
              }
            >
              <Card.Content>
                <Ionicons
                  name="checkmark-done-circle-outline"
                  size={26}
                  color={appTheme.colors.secondary}
                />
                <Text
                  variant="titleMedium"
                  style={[styles.cardTitle, styles.metricTitle]}
                >
                  Completed
                </Text>
                <Text variant="headlineMedium" style={styles.cardValue}>
                  {stats.completed}
                </Text>
              </Card.Content>
            </Card>

            {/* Pending */}
            <Card
              style={[styles.card, styles.cardHalf]}
              mode="elevated"
              elevation={2}
              onPress={() =>
                navigation.navigate('Tasks', {
                  screen: 'TaskList',
                  params: { filter: 'pending', title: 'Pending Tasks' },
                })
              }
            >
              <Card.Content>
                <Ionicons
                  name="time-outline"
                  size={26}
                  color={appTheme.colors.tertiary}
                />
                <Text
                  variant="titleMedium"
                  style={[styles.cardTitle, styles.metricTitle]}
                >
                  Pending
                </Text>
                <Text variant="headlineMedium" style={styles.cardValue}>
                  {stats.pending}
                </Text>
              </Card.Content>
            </Card>

            {/* Overdue */}
            <Card
              style={[styles.card, styles.cardHalf]}
              mode="elevated"
              elevation={2}
              onPress={() =>
                navigation.navigate('Tasks', {
                  screen: 'TaskList',
                  params: { filter: 'overdue', title: 'Overdue Tasks' },
                })
              }
            >
              <Card.Content>
                <Ionicons
                  name="alert-circle-outline"
                  size={26}
                  color={appTheme.colors.error}
                />
                <Text
                  variant="titleMedium"
                  style={[styles.cardTitle, styles.metricTitle]}
                >
                  Overdue
                </Text>
                <Text variant="headlineMedium" style={styles.cardValue}>
                  {stats.overdue}
                </Text>
              </Card.Content>
            </Card>

            {/* Open */}
            <Card
              style={[styles.card, styles.cardHalf]}
              mode="elevated"
              elevation={2}
              onPress={() =>
                navigation.navigate('Tasks', {
                  screen: 'TaskList',
                  params: { filter: 'open', title: 'Open Tasks' },
                })
              }
            >
              <Card.Content>
                <Ionicons
                  name="folder-open-outline"
                  size={26}
                  color="#8B5CF6"
                />
                <Text
                  variant="titleMedium"
                  style={[styles.cardTitle, styles.metricTitle]}
                >
                  Open Tasks
                </Text>
                <Text variant="headlineMedium" style={styles.cardValue}>
                  {stats.open_tasks}
                </Text>
              </Card.Content>
            </Card>

            {/* Completion Rate */}
            <Card
              style={[styles.card, styles.cardFull]}
              mode="elevated"
              elevation={2}
            >
              <Card.Content style={styles.cardContentRow}>
                <View>
                  <Text variant="titleMedium" style={styles.cardTitle}>
                    Completion Rate
                  </Text>
                  <Text
                    variant="displaySmall"
                    style={[
                      styles.cardValue,
                      { color: appTheme.colors.secondary },
                    ]}
                  >
                    {stats.completion_rate.toFixed(1)}%
                  </Text>
                </View>
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: appTheme.colors.secondaryContainer },
                  ]}
                >
                  <Ionicons
                    name="trending-up-outline"
                    size={28}
                    color={appTheme.colors.secondary}
                  />
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  animatedContainer: {
    flex: 1,
  },
  orbA: {
    position: 'absolute',
    right: -60,
    top: 60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: appTheme.colors.primaryContainer,
    opacity: 0.7,
  },
  orbB: {
    position: 'absolute',
    left: -40,
    top: 240,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: appTheme.colors.secondaryContainer,
    opacity: 0.6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: appTheme.roundness * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  cardFull: {
    width: '100%',
  },
  cardHalf: {
    width: '48%',
  },
  cardContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: appTheme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  metricTitle: {
    marginTop: 8,
  },
  cardValue: {
    color: appTheme.colors.onSurface,
    fontWeight: '800',
    marginTop: 4,
  },
});

export default React.memo(DashboardScreen);
