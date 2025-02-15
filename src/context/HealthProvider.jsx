import React, { createContext, useState } from "react";

export const HealthContext = createContext(null);
const HealthProvider = ({ children }) => {
  const [searchKey, setSearchKey] = useState("");
  const [searchedFeed, setSearchedFeed] = useState([]);
  const value = {
    searchKey,
    setSearchKey,
    searchedFeed,
    setSearchedFeed,
  };
  return (
    <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
  );
};

export default HealthProvider;
