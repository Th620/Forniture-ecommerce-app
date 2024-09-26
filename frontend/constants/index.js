import Logo from "../assets/DECO.svg";
import LogoDark from "../assets/DECO-2.svg";
import { IoIosSearch } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";

const BASE_URL = "http://localhost:8080/uploads/";

const navLinks = [
  {
    id: "home",
    title: "Home",
    link: "",
  },
  {
    id: "categories",
    link: "categories",
    title: "Categories",
  },
  {
    id: "products",
    title: "Products",
    link: "products",
  },
  {
    id: "customize",
    title: "Customize",
    link: "customize",
  },
];

const navBtns = [
  {
    id: "search",
    link: "",
    icon: <IoIosSearch />,
  },
  {
    id: "profile",
    link: "profile",
    icon: <FiUser />,
  },
  {
    id: "cart",
    link: "cart",
    icon: <IoBagOutline />,
  },
];

const footerSections = [
  { id: "store", title: "Store", links: ["About", "Help", "F&Q"] },
  {
    id: "service",
    title: "Service",
    links: ["Paymant", "Delivery", "Contacts"],
  },
  {
    id: "follow us",
    title: "Follow us",
    links: ["Instagram", "Facebook", "Twitter"],
  },
];

export { Logo, LogoDark };
export { navLinks, navBtns, footerSections, BASE_URL };
