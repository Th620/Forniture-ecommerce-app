"use client";

import { Logo, navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiMenu, FiUser } from "react-icons/fi";
import Menu from "./Menu";
import { usePathname } from "next/navigation";
import { IoIosSearch } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useStateContext } from "@/context/StateContext";
import CartContainer from "./CartContainer";
import SearchClient from "./SearchClient";

const NavBar = ({}) => {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  const pathName = usePathname();

  const { openCart, setOpenCart } = useStateContext();
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop >= 150) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`font-montserrat fixed top-0 left-0 flex justify-between items-center w-full px-10 md:px-75 lg:px-150 py-5 text-black z-[100] 
        ${
          scrolled
            ? "bg-white"
            : pathName === "/"
            ? "bg-transparent"
            : "bg-white"
        }
      `}
    >
      {openSearch && <SearchClient setOpenSearch={setOpenSearch} />}
      <div className="w-full flex justify-between items-center">
        <Link href={"/"}>
          <Image src={Logo} width={65} height={39} alt="logo" />
        </Link>

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
            <li className="h-[20px]">
              <button
                type="button"
                onClick={() => setOpenSearch(true)}
                className="text-xl h-[20px]"
              >
                <IoIosSearch />
              </button>
            </li>
            <Link
              href={{
                pathname: `/${!user?.userInfo ? "account/sign-in" : "profile"}`,
              }}
            >
              <li className="">
                {user?.userInfo?.firstName ? (
                  <div className="rounded-full w-5 h-5 uppercase flex justify-center items-center  font-meduim text-[10px] border-[1.5px] border-black font-lato">
                    {user.userInfo.firstName[0]}
                  </div>
                ) : (
                  <FiUser />
                )}
              </li>
            </Link>

            <li className="relative w-fit">
              {cart?.totalQuantity > 0 && (
                <span className="absolute -right-1 -top-0.5 h-3 w-3 text-[8px] font-semibold flex justify-center items-center rounded-full bg-red-700 text-white">
                  {cart.totalQuantity}
                </span>
              )}
              <Link href={"/cart"}>
                <IoBagOutline
                  className="text-xl cursor-pointer"
                  onMouseOver={() => {
                    setOpenCart(true);
                  }}
                />
              </Link>
              {openCart && cart?.items?.length > 0 && (
                <CartContainer setOpenCart={setOpenCart} />
              )}
            </li>
          </ul>
        </>
      </div>
      <button
        onClick={() => {
          setOpenMenu(true);
        }}
        type="button"
      >
        <FiMenu className="block lg:hidden max-lg:text-2xl" />
      </button>
      {openMenu && (
        <Menu
          setOpenMenu={setOpenMenu}
          setOpenSearch={setOpenSearch}
          user={user}
        />
      )}
    </nav>
  );
};

export default NavBar;
