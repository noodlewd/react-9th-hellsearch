import React, { createContext, useState } from "react";

export const HealthContext = createContext(null);
const HealthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return <HealthContext.Provider value={(email, setEmail, password, setPassword)}>{children}</HealthContext.Provider>;
};

export default HealthProvider;
