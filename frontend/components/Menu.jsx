import { navBtns, navLinks } from "@/constants";
import Link from "next/link";
import React from "react";
import { CgClose } from "react-icons/cg";
import { FiUser } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";

const Menu = ({ setOpenMenu, setOpenSearch, user }) => {
  return (
    <div className="flex justify-center items-center flex-col gap-y-14 lg:hidden fixed top-0 left-0 w-full h-screen bg-white text-black transition-all duration-200 z-50">
      <ul className="flex flex-col justify-center items-center gap-y-6">
        {navLinks.map((navLink) => (
          <Link
            href={{ pathname: `/${navLink.link}` }}
            key={navLink.id}
            onClick={() => setOpenMenu(false)}
          >
            <li className="hover:text-navy text-xl font-medium">
              {navLink.title}
            </li>
          </Link>
        ))}
      </ul>
      <ul className="flex flex-col justify-center items-center gap-y-6">
        <Link href={{ pathname: `/cart` }} onClick={() => setOpenMenu(false)}>
          <li className="text-2xl">
            <IoBagOutline />
          </li>
        </Link>
        <li className="text-2xl">
          <button
            type="button"
            onClick={() => {
              setOpenSearch(true);
              setOpenMenu(false);
            }}
          >
            <IoIosSearch />
          </button>
        </li>
        <Link
          href={{ pathname: `/${user ? "profile" : "account/sign-in"}` }}
          onClick={() => setOpenMenu(false)}
        >
          <li className="text-2xl">
            <FiUser />
          </li>
        </Link>
      </ul>
      <button
        type="button"
        className="absolute top-6 right-8 text-2xl"
        onClick={() => setOpenMenu(false)}
      >
        <CgClose />
      </button>
    </div>
  );
};

export default Menu;
