import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

interface LoaderProps {
  variant?: 'spinner' | 'skeleton';
  rows?: number;
}

const Loader = ({ variant = 'spinner', rows = 4 }: LoaderProps) => {
  if (variant === 'skeleton') {
    return (
      <View style={styles.skeletonContainer}>
        {Array.from({ length: rows }).map((_, index) => (
          <View key={index} style={styles.skeletonCard} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonContainer: {
    gap: 12,
    padding: 16,
  },
  skeletonCard: {
    height: 90,
    borderRadius: 12,
    backgroundColor: '#E8EDF2',
  },
});

export default Loader;
