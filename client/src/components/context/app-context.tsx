// src/components/context/app-context.tsx
import React, { createContext, useContext, useMemo, useState } from "react";
import type { YunoInstance } from "@yuno-payments/sdk-web-types";

type AppContextType = {
  checkoutSession: string | null;
  countryCode: string;
  yunoInstance: YunoInstance | null;

  setCheckoutSession: (s: string | null) => void;
  setCountryCode: (c: string) => void;
  setYunoInstance: (y: YunoInstance | null) => void;
};

// Create context with no default object (avoids accidental misuse)
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checkoutSession, setCheckoutSession] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string>("BR");
  const [yunoInstance, setYunoInstance] = useState<YunoInstance | null>(null);

  const value = useMemo(
    () => ({
      checkoutSession,
      countryCode,
      yunoInstance,
      setCheckoutSession,
      setCountryCode,
      setYunoInstance,
    }),
    [checkoutSession, countryCode, yunoInstance]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Handy hook so consumers are clean and safe
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
};