"use client";

import DashboardNav from "@/components/DashboardNav";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import SideBar from "@/components/SideBar";
import { Suspense, useEffect, useState } from "react";
import AuthProvider from "@/context/AuthContext";
import Loading from "../loading";
import DashboardSearch from "@/components/DashboardSearch";

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
    } else {
      setTheme("light");
    }
  }, []);

  const [openSearch, setopenSearch] = useState(false);

  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <Suspense fallback={<Loading />}>
          <div
            className={`relative ${
              localStorage.theme === "dark" ||
              (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? "dark"
                : ""
            }`}
          >
            <SideBar
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              setOpenSearch={setopenSearch}
            />
            <DashboardNav
              setShowMenu={setShowMenu}
              theme={theme}
              setTheme={setTheme}
            />
            {children}{" "}
            {openSearch && <DashboardSearch setOpenSearch={setopenSearch} />}
          </div>
        </Suspense>
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
