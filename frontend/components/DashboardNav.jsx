"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { CiDark } from "react-icons/ci";
import { FiSun } from "react-icons/fi";
import { MdNotificationsNone } from "react-icons/md";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { useSelector } from "react-redux";

const DashboardNav = ({ setShowMenu, theme, setTheme }) => {
  const pathname = usePathname();

  let user = useSelector((state) => state.user);

  const [active, setActive] = useState("");

  useEffect(() => {
    const path = pathname.split("/")[2] ? pathname.split("/")[2] : "";
    setActive(path);
  }, [pathname]);

  return (
    <nav className="md:w-4/5 z-50 w-full fixed top-0 right-0 h-[60px] border-b-[0.5px] border-gray border-opacity-40 flex items-center justify-between px-6 font-montserrat text-black dark:text-white bg-white dark:bg-darkBg">
      <div className="flex items-center justify-center h-8 md:h-fit gap-x-2">
        <HiOutlineMenuAlt1
          onClick={() => setShowMenu((prev) => !prev)}
          className="md:hidden text-xl cursor-pointer"
        />
        <h1 className="font-semibold capitalize text-xl min-w-[100px]">
          {active === "" ? "dashboard" : active}
        </h1>
      </div>
      <div className="md:flex items-center gap-x-3 hidden">
        <IoSearch className="text-[#8C8C8C]" />
        <label htmlFor="search" className="sr-only">
          Search:
        </label>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search here..."
          className="h-8 bg-transparent placeholder:text-[#8C8C8C] dark:text-bg outline-none text-black"
        />
      </div>
      <div className="flex  items-center gap-x-3">
        {theme === "dark" ? (
          <button
            onClick={() => {
              localStorage.setItem("theme", "light");
              setTheme("light");
            }}
            className="size-[30px] bg-input dark:bg-opacity-10 dark:hover:bg-opacity-15 transition-all duration-75 hover-bg-bg rounded-full text-[#8C8C8C] flex justify-center items-center"
          >
            <FiSun className="size-[18px]" />
          </button>
        ) : (
          <button
            onClick={() => {
              localStorage.setItem("theme", "dark");
              setTheme("dark");
            }}
            className="size-[30px] bg-input dark:bg-opacity-10 dark:hover:bg-opacity-15 transition-all duration-75 hover-bg-bg rounded-full text-[#8C8C8C] flex justify-center items-center"
          >
            <CiDark className="size-[18px]" />
          </button>
        )}

        <MdNotificationsNone className="size-[30px] p-[6px] dark:bg-opacity-10 dark:hover:bg-opacity-15 transition-all duration-75 hover-bg-bg bg-input rounded-full text-[#8C8C8C]" />

        <div className="size-[30px] rounded-full dark:bg-opacity-10 dark:hover:bg-opacity-15 transition-all duration-75 hover-bg-bg bg-input capitalize flex justify-center items-center text-[#8C8C8C] dark:text-gray">
          {user?.userInfo?.firstName && user.userInfo.firstName[0]}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
