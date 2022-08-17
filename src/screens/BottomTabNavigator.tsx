import React from 'react';
import { theme } from '../theme';
import { HomeIcon, ListIcon, AnalyticsIcon } from '../components/Icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './Home';
import { History } from './History';
import { Analytics } from './Analytics';

const BottomTabs = createBottomTabNavigator();

export const BottomTabsNavigator: React.FC = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => ({
        headerTitleStyle: { fontFamily: theme.fontFamilyBold },
        tabBarShowLabel: false, //show text below the icon
        tabBarActiveTintColor: theme.colorBlue,
        tabBarInactiveTintColor: theme.colorGrey,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <HomeIcon color={color} size={size} />;
          } else if (route.name === 'History') {
            return <ListIcon color={color} size={size} />;
          } else if (route.name === 'Analytics') {
            return <AnalyticsIcon color={color} size={size} />;
          } else {
            return null;
          }
        },
      })}>
      <BottomTabs.Screen
        name="Home"
        component={Home}
        options={{ title: "Today's Mood" }}
      />
      <BottomTabs.Screen
        name="History"
        component={History}
        options={{ title: 'Past Moods' }}
      />
      <BottomTabs.Screen
        name="Analytics"
        component={Analytics}
        options={{ title: 'Fancy Charts' }}
      />
    </BottomTabs.Navigator>
  );
};
