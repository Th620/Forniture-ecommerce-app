import { navBtns, navLinks } from "@/constants";
import Link from "next/link";
import React from "react";
import { CgClose } from "react-icons/cg";

const Menu = ({ setOpenMenu }) => {
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
        {navBtns.map((navBtn) => (
          <Link
            href={{ pathname: `/${navBtn.link}` }}
            key={navBtn.id}
            onClick={() => setOpenMenu(flase)}
          >
            <li className="text-2xl">{navBtn.icon}</li>
          </Link>
        ))}
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
