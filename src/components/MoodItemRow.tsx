import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAppContext } from '../App.Provider';
import format from 'date-fns/format';
import { MoodOptionWithTimestamp } from '../types';
import { theme } from '../theme';

type MoodItemRowProps = {
  item: MoodOptionWithTimestamp;
};

const maxPan = 80;

export const MoodItemRow: React.FC<MoodItemRowProps> = ({ item }) => {
  const appContext = useAppContext();

  const handlePress = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    appContext.handleDeleteMood(item);
  }, [appContext, item]);

  const offset = useSharedValue(0);

  const removeWithDelay = useCallback(() => {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      appContext.handleDeleteMood(item);
    }, 250);
  }, [appContext, item]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { shouldRemove: boolean }
  >({
    onActive: (event, ctx) => {
      const xVal = Math.floor(event.translationX);
      offset.value = xVal;

      if (Math.abs(xVal) <= maxPan) {
        ctx.shouldRemove = false;
      } else {
        ctx.shouldRemove = true;
      }
    },
    onEnd: (_, ctx) => {
      if (ctx.shouldRemove) {
        offset.value = withTiming(Math.sign(offset.value) * 2000);
        runOnJS(removeWithDelay)();
      } else {
        offset.value = withTiming(0);
      }
    },
  });

  return (
    <PanGestureHandler activeOffsetX={[-5, 5]} onGestureEvent={onGestureEvent}>
      <Animated.View style={[styles.moodItem, animatedStyle]}>
        <View style={styles.iconAndDescription}>
          <Text style={styles.moodValue}>{item.mood.emoji}</Text>
          <Text style={styles.moodDescription}>{item.mood.description}</Text>
        </View>
        <Text style={styles.moodDate}>
          {format(new Date(item.timestamp), "dd MMM, yyyy 'at' h:mmaaa")}
        </Text>
        <Pressable hitSlop={16} onPress={() => handlePress()}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  deleteText: {
    color: theme.colorBlue,
    fontFamily: theme.fontFamilyLight,
  },
  moodValue: {
    fontFamily: theme.fontFamilyRegular,
    textAlign: 'center',
    fontSize: 40,
    marginRight: 10,
  },
  moodDate: {
    fontFamily: theme.fontFamilyRegular,
    textAlign: 'center',
    color: theme.colorLavender,
  },
  moodItem: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodDescription: {
    fontSize: 18,
    color: theme.colorPurple,
    fontWeight: 'bold',
  },
  iconAndDescription: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
