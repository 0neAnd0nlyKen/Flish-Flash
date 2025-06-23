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
    genre: ["All"],
    playtime: [0],
  });

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}