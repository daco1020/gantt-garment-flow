import { createContext, useContext, useState, ReactNode } from "react";

interface LaunchDateContextType {
  launchDate: Date | undefined;
  setLaunchDate: (date: Date | undefined) => void;
}

const LaunchDateContext = createContext<LaunchDateContextType | undefined>(undefined);

export const useLaunchDate = () => {
  const context = useContext(LaunchDateContext);
  if (!context) {
    throw new Error("useLaunchDate must be used within a LaunchDateProvider");
  }
  return context;
};

interface LaunchDateProviderProps {
  children: ReactNode;
}

export const LaunchDateProvider = ({ children }: LaunchDateProviderProps) => {
  const [launchDate, setLaunchDate] = useState<Date | undefined>(new Date("2024-09-10"));

  return (
    <LaunchDateContext.Provider value={{ launchDate, setLaunchDate }}>
      {children}
    </LaunchDateContext.Provider>
  );
};