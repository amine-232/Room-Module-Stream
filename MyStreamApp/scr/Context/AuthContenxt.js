import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Auth/Firebase";

const AuthContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unSubscibe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unSubscibe;
  });

  useEffect(() => {
    if (user !== null) {
      setUserId(user.uid);
    }
  });

  const contextValue = { user, userId };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { ContextProvider, AuthContext };
