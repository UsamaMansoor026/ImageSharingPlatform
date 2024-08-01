import { createContext, useState } from "react";

const userDataFromLocalStorage = localStorage.getItem("user");
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userStatus, setUserStatus] = useState(userDataFromLocalStorage);

  const handleUserStatus = (user) => {
    const stringUser = JSON.stringify(user);
    setUserStatus(user);
    localStorage.setItem("user", stringUser);
    console.log(localStorage.getItem("user"));
  };

  const handleRemoveUser = () => {
    localStorage.removeItem("user");
    console.log("User Removed");
  };

  const JSONData = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  return (
    <UserContext.Provider
      value={{ userStatus, handleUserStatus, handleRemoveUser, JSONData }}
    >
      {children}
    </UserContext.Provider>
  );
};
