import React, { createContext } from "react";

export const HealthContext = createContext(null);

const HealthProvider = ({ children }) => {
  return <HealthContext.Provider>{children}</HealthContext.Provider>;
};

export default HealthProvider;
