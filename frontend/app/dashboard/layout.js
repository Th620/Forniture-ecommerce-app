"use client";

import DashboardNav from "@/components/DashboardNav";
import SideBar from "@/components/SideBar";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState();

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark");
    }else{
      setTheme("light")
    }
  }, []);

  return (
    <div
      className={`${
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches) 
          ? "dark"
          : ""
      }`}
    >
      <SideBar showMenu={showMenu} setShowMenu={setShowMenu} />
      <DashboardNav
        setShowMenu={setShowMenu}
        theme={theme}
        setTheme={setTheme}
      />
      {children}
    </div>
  );
}
