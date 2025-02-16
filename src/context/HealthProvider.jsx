import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const HealthContext = createContext(null);
const HealthProvider = ({ children }) => {
  const [searchKey, setSearchKey] = useState("");
  const [searchedFeed, setSearchedFeed] = useState([]);
  // const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(false);

  // const onLogoClick = () => {
  //   setSearchedFeed([]);
  //   setSearchKey("");
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     navigate("/feedMain");
  //     setIsLoading(false);
  //   }, 1000);
  // };
  const value = {
    searchKey,
    setSearchKey,
    searchedFeed,
    setSearchedFeed,
    // navigate,
    // onLogoClick,
    // isLoading,
    // setIsLoading,
  };
  return (
    <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
  );
};

export default HealthProvider;
