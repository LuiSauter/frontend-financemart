'use client'
import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the type for the balance object
interface Balance {
  entries: unknown[]; // Replace `any` with the specific type of entries if known
}

// Define the context value type
interface BalanceContextType {
  balance: Balance;
  setBalance: React.Dispatch<React.SetStateAction<Balance>>;
}

// Create the context with the proper type
const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// Define the provider's props type
interface BalanceProviderProps {
  children: ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState<Balance>({
    entries: [],
  });

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};