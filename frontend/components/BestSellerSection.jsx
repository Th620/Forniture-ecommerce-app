"use client";

import { categories } from "@/constants";
import React, { useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import ProductCard from "./ProductCard";

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
];

const BestSellerSection = () => {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState("all categories");

  return (
    <section className="flex flex-col justify-center px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14">
      <h2 className="max-md:text-center text-[32px] font-semibold pb-14">
        Best Seller
      </h2>
      <form>
        <select
          name="category"
          className="capitalize block md:hidden bg-white pr-6 py-2 border-none"
        >
          {categories.map((category) => (
            <option value={category} key={category.id} className="bg-yellow">
              {category.title}
            </option>
          ))}
        </select>
      </form>
      <div className="hidden md:flex justify-between w-full items-center">
        <div className="flex items-center gap-x-4">
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => {
                setActive(category.id);
              }}
              className={`${
                active === category.id
                  ? "text-yellow font-semibold"
                  : "text-black font-normal"
              } capitalize text-sm`}
            >
              {category.title}
            </button>
          ))}
        </div>
        <div className="flex text-lg">
          <button
            type="button"
            className={`${index === 0 ? "text-gray" : "text-black"}`}
            onClick={() => {
              if (index > 0) {
                setIndex((prev) => prev - 1);
              }
            }}
          >
            <MdKeyboardArrowLeft />
          </button>
          <button
            type="button"
            className={`${
              index === products.length - 4 ? "text-gray" : "text-black"
            }`}
            onClick={() => {
              if (index < products.length - 4) {
                setIndex((prev) => prev + 1);
              }
            }}
          >
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-4 gap-y-4 py-3">
        {products.slice(index, index + 4).map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            className={"col-span-12 sm:col-span-6 md:col-span-3"}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSellerSection;
