import React, { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Platform, Text, TouchableOpacity, View } from 'react-native';

export default function KeyboardDoneToolbar({ enabled = true, isDarkMode }) {
  const bottom = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || Platform.OS !== 'ios') return undefined;

    const showSubscription = Keyboard.addListener('keyboardWillShow', (event) => {
      setVisible(true);
      Animated.timing(bottom, {
        toValue: event.endCoordinates?.height || 0,
        duration: event.duration || 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSubscription = Keyboard.addListener('keyboardWillHide', (event) => {
      Animated.timing(bottom, {
        toValue: 0,
        duration: event.duration || 200,
        useNativeDriver: false,
      }).start(() => {
        setVisible(false);
      });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [bottom, enabled]);

  if (!enabled || Platform.OS !== 'ios') return null;
  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        zIndex: 1000,
        elevation: 1000,
      }}>
      <View
        style={{
          alignItems: 'flex-end',
          backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
          borderTopColor: isDarkMode ? '#334155' : '#cbd5e1',
          borderTopWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}>
        <TouchableOpacity onPress={Keyboard.dismiss} hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}>
          <Text style={{ color: '#86B749', fontSize: 16, fontWeight: '800' }}>
            Fine
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
