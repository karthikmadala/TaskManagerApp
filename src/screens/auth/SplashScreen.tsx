import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Image } from 'react-native';
import { Text } from 'react-native-paper';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        <View style={styles.iconCircle}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.brandTitle}>Taskify</Text>
        <Text style={styles.brandSubtitle}>Manage your tasks with ease</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4338CA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E1B4B',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#4F46E5',
    marginTop: 8,
    fontWeight: '500',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'contain',
  },
});

export default SplashScreen;

//  codex resume 019cc8bc-d78b-7901-85e3-8b22ae8f41c8
