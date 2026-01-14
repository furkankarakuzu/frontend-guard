import React, { createContext, useContext } from "react";
import type { GuardError } from "@frontend-guard-org/core";

type GuardFallback = (error: GuardError) => React.ReactNode;

type GuardContextValue = {
  fallback?: GuardFallback;
};

const GuardContext = createContext<GuardContextValue>({});

export function GuardProvider({
  fallback,
  children,
}: {
  fallback?: GuardFallback;
  children: React.ReactNode;
}) {
  return (
    <GuardContext.Provider value={{ fallback }}>
      {children}
    </GuardContext.Provider>
  );
}

export function useGuardContext() {
  return useContext(GuardContext);
}
