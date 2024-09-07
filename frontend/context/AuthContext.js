"use client";

import { getProfile } from "@/services/user";
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handelGetUser = async () => {
    try {
      const profile = await getProfile();
      if (profile) {
        setUser(profile);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return async () => {
      await handelGetUser();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
