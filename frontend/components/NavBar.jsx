"use client";

import { Logo, navBtns, navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import Menu from "./Menu";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

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
              {navBtns.map((navBtn) => (
                <Link
                  href={{
                    pathname: `/${navBtn.link}`,
                  }}
                  key={navBtn.id}
                >
                  <li className="text-xl">{navBtn.icon}</li>
                </Link>
              ))}
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