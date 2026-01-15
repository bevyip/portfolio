import React, { createContext, useContext, useState } from "react";

const PlayPageContext = createContext();

export const PlayPageProvider = ({ children }) => {
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
  if (!context) {
    return {
      isGridVisible: false,
      setIsGridVisible: () => {},
      isBentoVisible: false,
      setIsBentoVisible: () => {},
    };
  }
  return context;
};
