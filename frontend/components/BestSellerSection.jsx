"use client";

import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import ProductCard from "./ProductCard";
import { getBestSellers } from "@/services/products";
import { getCategories } from "@/services/category";

// const products = [
//   {
//     id: 1,
//     title: "chair",
//     price: 45.5,
//     keywords: [],
//     productInfo: "",
//     stock: 10,
//     category: "",
//     image: "",
//   },
//   {
//     id: 2,
//     title: "chair",
//     price: 45.99,
//     keywords: [],
//     productInfo: "",
//     stock: 10,
//     category: "",
//     image: "",
//   },
//   {
//     id: 3,
//     title: "chair",
//     price: 45.0,
//     keywords: [],
//     productInfo: "",
//     stock: 10,
//     category: "",
//     image: "",
//   },
//   {
//     id: 4,
//     title: "chair",
//     price: 45.0,
//     keywords: [],
//     productInfo: "",
//     stock: 10,
//     category: "",
//     image: "",
//   },
//   {
//     id: 1,
//     title: "chair",
//     price: 45.5,
//     keywords: [],
//     productInfo: "",
//     stock: 10,
//     category: "",
//     image: "",
//   },
//   {
//     id: 2,
//     title: "chair",
//     price: 45.99,
//     keywords: [],
//     productInfo: "",
//     stock: 10,
//     category: "",
//     image: "",
//   },
//   {
//     id: 3,
//     title: "chair",
//     price: 45.0,
//     keywords: [],
//     productInfo: "",
//     stock: 10,
//     category: "",
//     image: "",
//   },
//   {
//     id: 4,
//     title: "chair",
//     price: 45.0,
//     keywords: [],
//     productInfo: "",
//     stock: 10,
//     category: "",
//     image: "",
//   },
// ];

const BestSellerSection = () => {
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState("all categories");
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleGetBestSellers = async (category) => {
    try {
      const data = await getBestSellers({
        category: category !== "all categories" ? category : "",
      });
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      setError({ Error: error });
    }
  };

  const handleGetCategories = async () => {
    try {
      const data = await getCategories();
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetBestSellers(active);
      await handleGetCategories();
    };
  }, []);

  return (
    <section className="flex flex-col justify-center px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14">
      <h2 className="text-center text-[32px] font-semibold pb-14">
        Best Seller
      </h2>

      <select
        name="category"
        className="capitalize block md:hidden bg-white pr-6 py-2 border-none text-sm font-medium"
      >
        {[{ _id: 0, name: "all categories" }, ...categories].map((category) => (
          <option
            value={category}
            key={category?._id}
            className="font-montserrat"
          >
            {category?.name}
          </option>
        ))}
      </select>

      <div className="hidden md:flex justify-between w-full items-center">
        <div className="flex items-center gap-x-4 text-sm">
          {[{ _id: 0, name: "all categories" }, ...categories].map(
            (category) => (
              <button
                type="button"
                key={category?._id}
                onClick={async () => {
                  setActive(category?.name);
                  await handleGetBestSellers(category?.name);
                }}
                className={`${
                  active === category?.name
                    ? "text-yellow font-semibold"
                    : "text-black font-medium"
                } capitalize text-sm`}
              >
                {category?.name}
              </button>
            )
          )}
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
            key={product._id}
            className={"col-span-12 sm:col-span-6 md:col-span-3"}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSellerSection;
