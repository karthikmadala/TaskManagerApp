import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  count: number;
}

const Badge = ({ count }: BadgeProps) => {
  if (count <= 0) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E11D48',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default React.memo(Badge);
