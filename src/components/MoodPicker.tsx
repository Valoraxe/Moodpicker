import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { MoodOptionType } from '../types';
import { theme } from '../theme';
import Reanimated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type MoodPickerProps = {
  onSelect: (mood: MoodOptionType) => void;
};

const imageSrc = require('../assets/butterflies.png');

const moodOptions: MoodOptionType[] = [
  { emoji: '🧑‍💻', description: 'studious' },
  { emoji: '🤔', description: 'pensive' },
  { emoji: '😊', description: 'happy' },
  { emoji: '🥳', description: 'celebratory' },
  { emoji: '😤', description: 'frustrated' },
];

export const MoodPicker: React.FC<MoodPickerProps> = ({ onSelect }) => {
  const [selectedMood, setSelectedMood] = useState<MoodOptionType>();
  const [hasSelected, setHasSelected] = useState(false);

  const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

  const buttonStyle = useAnimatedStyle(
    () => ({
      opacity: selectedMood ? withTiming(1) : withTiming(0.5),
      transform: [{ scale: selectedMood ? withTiming(1) : 0.8 }],
    }),
    [selectedMood],
  );

  const handleSelect = React.useCallback(() => {
    if (selectedMood) {
      onSelect(selectedMood);
      setSelectedMood(undefined);
      setHasSelected(true);
    }
  }, [onSelect, selectedMood]);

  if (hasSelected) {
    return (
      <View style={[styles.moodTable, styles.centerStyle]}>
        <Image source={imageSrc} />
        <Pressable style={styles.button} onPress={() => setHasSelected(false)}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.moodTable}>
      <Text style={styles.titleText}>How are you feeling today?</Text>
      <View style={styles.moodList}>
        {moodOptions.map(option => (
          <View>
            <Pressable
              onPress={() => setSelectedMood(option)}
              key={option.emoji}
              style={[
                styles.moodItem,
                option.emoji === selectedMood?.emoji
                  ? styles.selectedMoodItem
                  : undefined,
              ]}>
              <Text style={styles.moodText}>{option.emoji}</Text>
            </Pressable>
            <Text style={styles.descriptionText}>
              {selectedMood?.emoji === option.emoji ? option.description : ' '}
            </Text>
          </View>
        ))}
      </View>
      <ReanimatedPressable
        style={[styles.centerStyle, buttonStyle]}
        onPress={handleSelect}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Choose</Text>
        </View>
      </ReanimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
    backgroundColor: theme.colorPurple,
  },
  buttonText: {
    fontFamily: theme.fontFamilyRegular,
    color: theme.colorWhite,
  },
  centerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionText: {
    color: theme.colorPurple,
    fontFamily: theme.fontFamilyRegular,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  moodText: {
    fontSize: 24,
  },
  moodList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  moodTable: {
    borderWidth: 2,
    margin: 15,
    padding: 10,
    borderColor: theme.colorPurple,
  },
  moodItem: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 5,
  },
  selectedMoodItem: {
    borderWidth: 2,
    backgroundColor: theme.colorPurple,
    borderColor: theme.colorWhite,
  },
  titleText: {
    fontFamily: theme.fontFamilyBold,
    fontSize: 20,
    textAlign: 'center',
  },
});
