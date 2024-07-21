import Logo from "../assets/DECO.svg";
import { IoIosSearch } from "react-icons/io";
import { IoBagOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";

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
    id: "customizing",
    title: "Customizing",
    link: "customizing",
  },
];

const navBtns = [
  {
    id: "search",
    link: "search",
    icon: <IoIosSearch />,
  },
  {
    id: "profile",
    link: "profile",
    icon: <FiUser />,
  },
  {
    id: "bag",
    link: "bag",
    icon: <IoBagOutline />,
  },
];

const footerSections = [
  { id: "store", title: "Store", links: ["About", "Help", "F&Q"] },
  {
    id: "service",
    title: "Service",
    links: ["Paymant", "Delivry", "Contacts"],
  },
  {
    id: "follow us",
    title: "Follow us",
    links: ["Instagram", "Facebook", "Twitter"],
  },
];

const categories = [
  { id: "all categories", title: "all categories" },
  {
    id: "sofas",
    title: "sofas",
  },
  {
    id: "chairs",
    title: "chairs",
  },
  {
    id: "untensils",
    title: "untensils",
  },
  {
    id: "lamps",
    title: "lamps",
  },
];

const products = [
  {
    id: 1,
    title: "chair",
    price: 45.5,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
  {
    id: 2,
    title: "chair",
    price: 45.99,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
  {
    id: 3,
    title: "chair",
    price: 45.0,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
  {
    id: 4,
    title: "chair",
    price: 45.0,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
  {
    id: 5,
    title: "chair",
    price: 45.5,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
  {
    id: 6,
    title: "chair",
    price: 45.99,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
  {
    id: 7,
    title: "chair",
    price: 45.0,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
  {
    id: 8,
    title: "chair",
    price: 45.0,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
];

const filter = {
  size: ["all", "small", "meduim", "large"],
  color: ["all", "white", "black", "beige", "blue", "yellow"],
  sort: ["no sort", "price low to hight", "price hight to low"],
};

// const categories = ["all categories", "sofas", "chairs", "untensils", "lamps"];

export { Logo };
export { navLinks, navBtns, footerSections, categories, products, filter };
