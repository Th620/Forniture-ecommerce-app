"use client";

import { Logo, navBtns, navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

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
      className={`font-montserrat fixed top-0 left-0 w-full flex justify-between items-center px-150 py-5 text-black ${
        scrolled ? "bg-white" : "bg-transparent"
      }`}
    >
      <Link href={"/"}>
        <Image src={Logo} width={65} height={39} alt="logo" />
      </Link>
      <ul className="flex justify-center items-center gap-x-6">
        {navLinks.map((navLink) => (
          <Link href={""}>
            <li className="hover:text-navy" key={navLink.id}>
              {navLink.title}
            </li>
          </Link>
        ))}
      </ul>
      <ul className="flex justify-center items-center gap-x-5">
        {navBtns.map((navBtn) => (
          <Link href={""}>
            <li className="text-xl" key={navBtn.id}>
              {navBtn.icon}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
