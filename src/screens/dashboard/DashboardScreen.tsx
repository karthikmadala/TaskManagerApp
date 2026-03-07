import React, { useCallback, useEffect, useState } from 'react';
import { Animated, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { dashboardApi } from '../../api/dashboardApi';
import { DashboardStats } from '../../types';
import { MainTabParamList } from '../../navigation/MainNavigator';

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
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await dashboardApi.getDashboard();
      setStats({ ...defaultStats, ...data });
    } catch {
      // Dashboard can fall back to local defaults when API is unavailable.
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

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <View style={styles.orbA} />
      <View style={styles.orbB} />
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              }),
            },
          ],
        }}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} />
          }>
        <Card style={[styles.card, styles.cardNeutral]}>
          <Card.Content>
            <Ionicons name="layers-outline" size={20} color="#334155" />
            <Text variant="titleMedium">Total Tasks</Text>
            <Text variant="headlineMedium">{stats.total}</Text>
          </Card.Content>
        </Card>
        <Card
          style={[styles.card, styles.cardGreen]}
          onPress={() =>
            navigation.navigate('Tasks', {
              screen: 'TaskList',
              params: { filter: 'completed', title: 'Completed Tasks' },
            })
          }>
          <Card.Content>
            <Ionicons name="checkmark-done-circle-outline" size={20} color="#0F766E" />
            <Text variant="titleMedium">Completed</Text>
            <Text variant="headlineMedium">{stats.completed}</Text>
          </Card.Content>
        </Card>
        <Card
          style={[styles.card, styles.cardBlue]}
          onPress={() =>
            navigation.navigate('Tasks', {
              screen: 'TaskList',
              params: { filter: 'pending', title: 'Pending Tasks' },
            })
          }>
          <Card.Content>
            <Ionicons name="time-outline" size={20} color="#1D4ED8" />
            <Text variant="titleMedium">Pending</Text>
            <Text variant="headlineMedium">{stats.pending}</Text>
          </Card.Content>
        </Card>
        <Card
          style={[styles.card, styles.cardOrange]}
          onPress={() =>
            navigation.navigate('Tasks', {
              screen: 'TaskList',
              params: { filter: 'overdue', title: 'Overdue Tasks' },
            })
          }>
          <Card.Content>
            <Ionicons name="alert-circle-outline" size={20} color="#C2410C" />
            <Text variant="titleMedium">Overdue</Text>
            <Text variant="headlineMedium">{stats.overdue}</Text>
          </Card.Content>
        </Card>
        <Card
          style={[styles.card, styles.cardPurple]}
          onPress={() =>
            navigation.navigate('Tasks', {
              screen: 'TaskList',
              params: { filter: 'open', title: 'Open Tasks' },
            })
          }>
          <Card.Content>
            <Ionicons name="folder-open-outline" size={20} color="#6D28D9" />
            <Text variant="titleMedium">Open Tasks</Text>
            <Text variant="headlineMedium">{stats.open_tasks}</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.card, styles.cardTeal]}>
          <Card.Content>
            <Ionicons name="trending-up-outline" size={20} color="#0F766E" />
            <Text variant="titleMedium">Completion Rate</Text>
            <Text variant="headlineMedium">{stats.completion_rate.toFixed(2)}%</Text>
          </Card.Content>
        </Card>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4FF',
  },
  content: {
    paddingBottom: 24,
  },
  orbA: {
    position: 'absolute',
    right: -60,
    top: 80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#D8E8FF',
  },
  orbB: {
    position: 'absolute',
    left: -40,
    top: 220,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E7E2FF',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
  },
  cardNeutral: {
    backgroundColor: '#FFFFFF',
  },
  cardGreen: {
    backgroundColor: '#ECFDF5',
  },
  cardBlue: {
    backgroundColor: '#EFF6FF',
  },
  cardOrange: {
    backgroundColor: '#FFF7ED',
  },
  cardPurple: {
    backgroundColor: '#F5F3FF',
  },
  cardTeal: {
    backgroundColor: '#ECFEFF',
  },
});

export default DashboardScreen;
