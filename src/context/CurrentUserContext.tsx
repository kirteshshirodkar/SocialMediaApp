"use client";

import {
  createContext,
  useContext,
} from "react";

type CurrentUserContextType = {
  currentUserId: string;
};

const CurrentUserContext =
  createContext<CurrentUserContextType | null>(null);

export function CurrentUserProvider({
  children,
  currentUserId,
}: {
  children: React.ReactNode;
  currentUserId: string;
}) {
  return (
    <CurrentUserContext.Provider
      value={{ currentUserId }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error(
      "useCurrentUser must be used inside CurrentUserProvider"
    );
  }

  return context;
}