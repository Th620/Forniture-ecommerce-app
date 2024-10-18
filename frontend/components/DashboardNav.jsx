"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { CiDark } from "react-icons/ci";
import { FiSun } from "react-icons/fi";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { useSelector } from "react-redux";
import { MdNotificationsNone } from "react-icons/md";
import NotificationContainer from "./NotificationContainer";
import { getMeetings } from "@/services/message";
import { getOrders, getOrdersToShip } from "@/services/order";

const handleGetMeetings = async () => {
  try {
    const response = await getMeetings({ d: new Date() });
    if (JSON.parse(response.headers?.get("X-Totalcount"))) {
      if (JSON.parse(response.headers.get("X-Totalcount")) === 1) {
        return {
          state: "meetings",
          content: `${JSON.parse(
            response.headers.get("X-Totalcount")
          )} Meeting today`,
        };
      } else if (JSON.parse(response.headers.get("X-Totalcount")) > 1) {
        return {
          state: "meetings",
          content: `${JSON.parse(
            response.headers.get("X-Totalcount")
          )} Meetings today`,
        };
      } else {
        return;
      }
    }
  } catch (error) {
    return;
  }
};

const handleGetOrdersToShip = async () => {
  try {
    const response = await getOrdersToShip({ shippingDate: new Date() });
    if (JSON.parse(response.headers?.get("X-Totalcount"))) {
      if (JSON.parse(response.headers.get("X-Totalcount")) === 1) {
        return {
          state: "shipping",
          content: `${JSON.parse(
            response.headers.get("X-Totalcount")
          )} Order to ship today`,
        };
      } else if (JSON.parse(response.headers.get("X-Totalcount")) > 1) {
        return {
          state: "shipping",
          content: `${JSON.parse(
            response.headers.get("X-Totalcount")
          )} Orders to ship today`,
        };
      } else {
        return;
      }
    }
  } catch (error) {
    return;
  }
};

const handleGetOrders = async () => {
  try {
    const response = await getOrders({ period: "today" });
    if (JSON.parse(response.headers?.get("X-Totalcount"))) {
      if (JSON.parse(response.headers.get("X-Totalcount")) === 1) {
        return {
          state: "orders",
          content: `${JSON.parse(
            response.headers.get("X-Totalcount")
          )} New order today`,
        };
      } else if (JSON.parse(response.headers.get("X-Totalcount")) > 1) {
        return {
          state: "orders",
          content: `${JSON.parse(
            response.headers.get("X-Totalcount")
          )} New orders today`,
        };
      } else {
        return;
      }
    }
  } catch (error) {
    return;
  }
};

const getNotifications = async () => {
  try {
    let n = [];
    const orders = await handleGetOrders();
    const shipping = await handleGetOrdersToShip();
    const meetings = await handleGetMeetings();
    if (orders) {
      n.push(orders);
    }
    if (shipping) {
      n.push(shipping);
    }
    if (meetings) {
      n.push(meetings);
    }
    return n;
  } catch (error) {
    return [];
  }
};

const DashboardNav = ({ setShowMenu, theme, setTheme }) => {
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [value, setvalue] = useState(searchParams.get("search") || "");

  let user = useSelector((state) => state.user);

  const [active, setActive] = useState("");
  const router = useRouter();

  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setnotifications] = useState([]);

  useEffect(() => {
    const path = pathname.split("/")[2] ? pathname.split("/")[2] : "";
    setActive(path);
  }, [pathname]);

  useEffect(() => {
    return async () => {
      const data = await getNotifications();
      if (data) {
        setnotifications([...data]);
      }
    };
  }, [pathname]);

  return (
    <nav className="md:w-4/5 z-50 w-full fixed top-0 right-0 h-[60px] border-b-[0.5px] border-gray border-opacity-40 flex items-center justify-between px-6 font-montserrat text-black dark:text-white bg-white dark:bg-darkBg">
      <div className="flex items-center justify-center h-8 md:h-fit gap-x-2">
        <HiOutlineMenuAlt1
          onClick={() => setShowMenu((prev) => !prev)}
          className="md:hidden text-xl cursor-pointer"
        />
        <h1 className="font-semibold capitalize text-xl min-w-[100px]">
          {active === "" ? "dashboard" : active.replace("-", " ")}
        </h1>
      </div>
      <form
        method="GET"
        onSubmit={(e) => {
          router.replace(
            `/dashboard/products?${new URLSearchParams({ search: value })}`,
            { scroll: true}
          );
        }}
        className="md:flex items-center gap-x-3 hidden"
      >
        <IoSearch className="text-[#8C8C8C]" />
        <label htmlFor="search" className="sr-only">
          Search:
        </label>
        <input
          type="search"
          name="search"
          id="search"
          value={value}
          onChange={(e) => setvalue(e.target.value)}
          placeholder="Search here..."
          className="h-8 bg-transparent placeholder:text-[#8C8C8C] dark:text-bg outline-none text-black"
        />
        <button type="submit" className="sr-only">
          search
        </button>
      </form>
      <div className="flex items-center gap-x-3">
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

        <div
          onClick={() => setOpenNotification((prev) => !prev)}
          className="relative size-[30px]"
        >
          <button type="button" className="relative">
            <MdNotificationsNone className="p-[6px] size-[30px] dark:bg-opacity-10 dark:hover:bg-opacity-15 transition-all duration-75 hover-bg-bg bg-input rounded-full text-[#8C8C8C]" />
            {notifications &&
              (notifications?.some((n) => !n.seen) ||
                (!notifications?.every((n) => n.seen) &&
                  !JSON.parse(localStorage.getItem("read"))?.value)) && (
                <span className="inline-block w-[5px] h-[5px] rounded-full bg-red-700 top-2 right-[9px] absolute"></span>
              )}
          </button>
          {openNotification && (
            <NotificationContainer
              notifications={notifications}
              setOpenNotification={setOpenNotification}
              className={"absolute top-9 -right-14"}
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => router.push("/profile", { scroll: true})}
          className="size-[30px] rounded-full dark:bg-opacity-10 dark:hover:bg-opacity-15 transition-all duration-75 hover-bg-bg bg-input capitalize flex justify-center items-center text-[#8C8C8C] dark:text-gray"
        >
          {user?.userInfo?.firstName && user.userInfo.firstName[0]}
        </button>
      </div>
    </nav>
  );
};

export default DashboardNav;
