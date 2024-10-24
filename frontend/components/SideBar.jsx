"use client";

import { Logo, LogoDark } from "@/constants";
import Image from "next/image";
import { RxDashboard } from "react-icons/rx";
import { AiOutlineUser } from "react-icons/ai";
import { FiBox } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { MdOutlineCategory, MdOutlineLocalShipping } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IoLogOutOutline, IoSearch } from "react-icons/io5";
import { logout } from "@/services/user";
import { resetUserInfo } from "@/lib/features/user/userSlice";
import { useDispatch } from "react-redux";

const SideBar = ({ showMenu, setShowMenu, setOpenSearch }) => {
  const pathname = usePathname();

  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const [active, setActive] = useState();

  const router = useRouter();

  const handleLogOut = async () => {
    try {
      await logout();
      dispatch(resetUserInfo());
      router.push("/", { scroll: true});
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const path = pathname.split("/")[2] ? pathname.split("/")[2] : "";
    setActive(path);
  }, [pathname]);

  return (
    <div
      className={`md:w-1/5 z-50 h-screen overflow-hidden w-full border-r-[0.5px] md:block border-gray border-opacity-40 fixed top-0 left-0 font-montserrat bg-white dark:bg-darkBg ${
        showMenu ? "block" : "hidden"
      }`}
    >
      <div className="flex justify-start top-0 left-0 py-5">
        <div className="xl:ml-11 lg:ml-7 md:ml-5 ml-3 w-16 h-5 relative md:block hidden">
          <Link
            href={{
              pathname: "/",
            }}
          >
            <Image
              src={
                localStorage.theme === "dark" ||
                (!("theme" in localStorage) &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches)
                  ? LogoDark
                  : Logo
              }
              objectFit="contain"
              layout="fill"
              alt="logo"
            />
          </Link>
        </div>
      </div>
      <div className="w-full md:py-5 px-3 flex flex-col items-center justify-between pt-10 sidebar">
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            onClick={() => {
              router.push("/dashboard", { scroll: true});
              setShowMenu(false);
            }}
            className={`text-[#8C8C8C] capitalize flex pl-10 xl:pl-8 lg:pl-4 md:pl-2 items-center py-3 hover:bg-navy transition-colors duration-100 hover:text-white rounded-[4px] gap-2 font-medium w-full ${
              active === "" ? "bg-navy text-white" : ""
            }`}
          >
            <RxDashboard />
            dashboard
          </button>
          <button
            onClick={() => {
              router.push("/dashboard/clients", { scroll: true});
              setShowMenu(false);
            }}
            className={`text-[#8C8C8C] capitalize flex pl-10 xl:pl-8 lg:pl-4 md:pl-2 items-center py-3 hover:bg-navy transition-colors duration-100 hover:text-white rounded-[4px] gap-2 font-meduim w-full ${
              active === "clients" ? "bg-navy text-white" : ""
            }`}
          >
            <AiOutlineUser />
            clients
          </button>
          <button
            onClick={() => {
              router.push("/dashboard/products", { scroll: true});
              setShowMenu(false);
            }}
            className={`text-[#8C8C8C] capitalize flex pl-10 xl:pl-8 lg:pl-4 md:pl-2 items-center py-3 hover:bg-navy transition-colors duration-100 hover:text-white rounded-[4px] gap-2 font-meduim w-full ${
              active === "products" ? "bg-navy text-white" : ""
            }`}
          >
            <FiBox />
            products
          </button>
          <button
            onClick={() => {
              router.push("/dashboard/categories", { scroll: true});
              setShowMenu(false);
            }}
            className={`text-[#8C8C8C] capitalize flex pl-10 xl:pl-8 lg:pl-4 md:pl-2 items-center py-3 hover:bg-navy transition-colors duration-100 hover:text-white rounded-[4px] gap-2 font-meduim w-full ${
              active === "categories" ? "bg-navy text-white" : ""
            }`}
          >
            <MdOutlineCategory />
            categories
          </button>
          <button
            onClick={() => {
              router.push("/dashboard/orders", { scroll: true});
              setShowMenu(false);
            }}
            className={`text-[#8C8C8C] capitalize flex pl-10 xl:pl-8 lg:pl-4 md:pl-2 items-center py-3 hover:bg-navy transition-colors duration-100 hover:text-white rounded-[4px] gap-2 font-meduim w-full ${
              active === "orders" ? "bg-navy text-white" : ""
            }`}
          >
            <FiEdit />
            orders
          </button>
          <button
            onClick={() => {
              router.push("/dashboard/shipping", { scroll: true});
              setShowMenu(false);
            }}
            className={`text-[#8C8C8C] capitalize flex pl-10 xl:pl-8 lg:pl-4 md:pl-2 items-center py-3 hover:bg-navy transition-colors duration-100 hover:text-white rounded-[4px] gap-2 font-meduim w-full  ${
              active === "shipping" ? "bg-navy text-white" : ""
            }`}
          >
            <MdOutlineLocalShipping />
            shipping
          </button>
          <button
            onClick={() => {
              router.push("/dashboard/custom-orders", { scroll: true});
              setShowMenu(false);
            }}
            className={`text-[#8C8C8C] capitalize flex pl-10 xl:pl-8 lg:pl-4 md:pl-2 items-center py-3 hover:bg-navy transition-colors duration-100 hover:text-white rounded-[4px] gap-2 font-meduim w-full ${
              active === "custom-orders" ? "bg-navy text-white" : ""
            }`}
          >
            <MdOutlineStorefront />
            Custom Orders
          </button>
          <button
            onClick={() => {
              router.push("/dashboard/admins", { scroll: true});
              setShowMenu(false);
            }}
            className={`text-[#8C8C8C] capitalize flex pl-10 xl:pl-8 lg:pl-4 md:pl-2 items-center py-3 hover:bg-navy transition-colors duration-100 hover:text-white rounded-[4px] gap-2 font-meduim w-full  ${
              active === "admins" ? "bg-navy text-white" : ""
            }`}
          >
            <MdOutlineAdminPanelSettings />
            Admins
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 w-full self-end">
          <button
            onClick={() => {
              setShowMenu(false);
              setOpenSearch(true);
            }}
            className={`text-[#8C8C8C] capitalize flex pl-10 xl:pl-8 lg:pl-4 md:pl-2 items-center py-3 hover:text-[#808080] dark:hover:text-bg rounded-[4px] gap-2 font-meduim w-full transition-colors duration-75 md:hidden`}
          >
            <IoSearch />
            Search
          </button>

          <button
            type="button"
            onClick={handleLogOut}
            className={`text-[#8C8C8C] capitalize flex pl-10 xl:pl-8 lg:pl-4 md:pl-2 items-center py-3 hover:text-red-400 rounded-[4px] gap-2 font-meduim  transition-colors duration-75 w-full `}
          >
            <IoLogOutOutline className="text-lg" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
