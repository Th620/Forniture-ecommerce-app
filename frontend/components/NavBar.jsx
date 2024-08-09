"use client";

import { Logo, navBtns, navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiMenu, FiUser } from "react-icons/fi";
import Menu from "./Menu";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hook";
import { IoIosSearch } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  let user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (
      localStorage.getItem("account") &&
      JSON.parse(localStorage.getItem("account")).expiresAt < Date.now()
    ) {
      localStorage.removeItem("account");
    }
  }, []);

  console.log(user);

  const pathName = usePathname();

  useEffect(() => {
    const handelScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop >= 150) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handelScroll);

    return () => window.addEventListener("scroll", handelScroll);
  }, []);

  return (
    <nav
      className={`font-montserrat fixed top-0 left-0 flex justify-between items-center w-full px-10 md:px-75 lg:px-150 py-5 text-black z-20 ${
        scrolled ? "bg-white" : pathName === "/" ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="w-full flex justify-between items-center">
        <Link href={"/"}>
          <Image src={Logo} width={65} height={39} alt="logo" />
        </Link>
        {!openMenu && (
          <>
            <ul className="hidden lg:flex text-sm font-semibold justify-center items-center gap-x-6">
              {navLinks.map((navLink) => (
                <Link
                  href={{ pathname: `/${navLink.link}` }}
                  key={navLink.id}
                  replace
                >
                  <li
                    className={`hover:text-navy ${
                      `/${navLink.link}` === pathName
                        ? "font-semibold text-navy"
                        : "text-black font-medium"
                    }`}
                  >
                    {navLink.title}
                  </li>
                </Link>
              ))}
            </ul>
            <ul className="hidden lg:flex justify-center items-center gap-x-5">
              <li className="text-xl">
                <IoIosSearch />
              </li>
              <Link
                href={{
                  pathname: `/${
                    !user.userInfo ? "account/sign-in" : "profile"
                  }`,
                }}
              >
                <li className="">
                  {user.userInfo ? (
                    <div className="rounded-full w-5 h-5 uppercase flex justify-center items-center  font-meduim text-xs border-[1.5px] border-black font-lato">
                      {user.userInfo.firstName[0]}
                    </div>
                  ) : (
                    <FiUser />
                  )}
                </li>
              </Link>

              <li className="text-xl">
                <IoBagOutline />
              </li>
            </ul>
          </>
        )}
      </div>
      <button
        onClick={() => {
          setOpenMenu(true);
        }}
        type="button"
      >
        <FiMenu className="block lg:hidden max-lg:text-2xl" />
      </button>

      {openMenu && <Menu setOpenMenu={setOpenMenu} />}
    </nav>
  );
};

export default NavBar;
