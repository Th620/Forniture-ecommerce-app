"use client";

import { createContext, useContext, useState } from "react";
import React from "react";

const StateContext = createContext(null);

export default function StateProvider({ children }) {
  const [openCart, setOpenCart] = useState(false);

  return (
    <StateContext.Provider value={{ openCart, setOpenCart }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);
