'use client'

import React, { createContext, useContext, useState } from 'react';

import { Preferences } from '../types/Preferences';

export const PreferencesContext = createContext({
  preferences: {} as Preferences,
  setPreferences: (preferences: Preferences) => {},
});

export default function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<Preferences>({
    Total: 0,
    Arcade: 0,
    Action: 0,
    Puzzle: 0,
    Adventure: 0,
    Sports: 0,
    Dress_up_games: 0,
    Driving: 0,
    Slacking: 0,
    Platformer: 0,
    Simulation: 0
  });

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}