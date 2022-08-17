import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodOptionType, MoodOptionWithTimestamp } from './types';

const storageKey = 'moodPicker-data';

type AppContextType = {
  moodList: MoodOptionWithTimestamp[];
  handleSelectMood: (mood: MoodOptionType) => void;
  handleDeleteMood: (mood: MoodOptionWithTimestamp) => void;
};

type AppData = {
  moods: MoodOptionWithTimestamp[];
};

interface Props {
  children: React.ReactNode;
}

const defaultValue = {
  moodList: [],
  handleSelectMood: () => {},
  handleDeleteMood: () => {},
};

const getAppData = async (): Promise<AppData | null> => {
  try {
    const data = await AsyncStorage.getItem(storageKey);

    if (data) {
      return JSON.parse(data);
    }

    return null;
  } catch {
    return null;
  }
};

const setAppData = async (newData: AppData) => {
  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
  } catch {}
};

const AppContext = createContext<AppContextType>(defaultValue);

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [moodList, setMoodList] = useState<MoodOptionWithTimestamp[]>([]);

  useEffect(() => {
    getDataFromStorage();
  }, []);

  const getDataFromStorage = async () => {
    const data = await getAppData();

    if (data) {
      setMoodList(data.moods);
    }
  };

  const handleSelectMood = useCallback((mood: MoodOptionType) => {
    setMoodList(current => {
      const newValue = [...current, { mood, timestamp: Date.now() }];
      setAppData({ moods: newValue });
      return newValue;
    });
  }, []);

  const handleDeleteMood = useCallback((mood: MoodOptionWithTimestamp) => {
    setMoodList(current => {
      const newValue = current.filter(
        item => item.timestamp !== mood.timestamp,
      );
      setAppData({ moods: newValue });
      return newValue;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{ moodList, handleSelectMood, handleDeleteMood }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
