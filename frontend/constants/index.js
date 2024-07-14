import Logo from "../assets/DECO.svg";
import { IoIosSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { IoBagOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";

const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "categories",
    title: "Categories",
  },
  {
    id: "products",
    title: "Products",
  },
  {
    id: "customizing",
    title: "Customizing",
  },
];

const navBtns = [
  {
    id: "search",
    icon: <IoIosSearch />,
  },
  {
    id: "profile",
    icon: <FiUser />,
  },
  {
    id: "bag",
    icon: <IoBagOutline />,
  },
];

const footerSections = [
  { id: "store",title: "Store", links: ["About", "Help", "F&Q"] },
  { id: "service",title: "Service", links: ["Paymant", "Delivry", "Contacts"] },
  { id: "follow us",title: "Follow us", links: ["Instagram", "Facebook", "Twitter"] },
];

export { Logo };
export { navLinks, navBtns, footerSections };
