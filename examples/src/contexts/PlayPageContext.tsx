import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlayPageContextType {
  isGridVisible: boolean;
  setIsGridVisible: (visible: boolean) => void;
  isBentoVisible: boolean;
  setIsBentoVisible: (visible: boolean) => void;
}

const PlayPageContext = createContext<PlayPageContextType | undefined>(undefined);

export const PlayPageProvider = ({ children }: React.PropsWithChildren) => {
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isBentoVisible, setIsBentoVisible] = useState(false);

  return (
    <PlayPageContext.Provider
      value={{
        isGridVisible,
        setIsGridVisible,
        isBentoVisible,
        setIsBentoVisible,
      }}
    >
      {children}
    </PlayPageContext.Provider>
  );
};

export const usePlayPage = () => {
  const context = useContext(PlayPageContext);
  if (context === undefined) {
    throw new Error('usePlayPage must be used within a PlayPageProvider');
  }
  return context;
};