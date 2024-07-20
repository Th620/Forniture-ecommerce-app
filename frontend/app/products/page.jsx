"use client";

import { categories, filter, products } from "@/constants";
import ProductCard from "@/components/ProductCard";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";
import FilterPopUp from "@/components/FilterPopUp";

export default function Products() {
  const [active, setActive] = useState("all categories");
  const [openSizeSelect, setOpenSizeSelect] = useState(false);
  const [openColorSelect, setOpenColorSelect] = useState(false);
  const [openSortSelect, setOpenSortSelect] = useState(false);
  const [openCategorySelect, setOpenCategorySelect] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sort, setSort] = useState("");

  return (
    <main className="relative flex flex-col justify-center sm:justify-start gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white py-14 pt-150 min-h-screen ">
      <h2 className="text-[32px] font-semibold capitalize">{active}</h2>
      <div className="grid grid-cols-12 gap-x-4 w-full">
        <div className="w-full hidden md:grid grid-cols-12 gap-4 col-span-12">
          <div className="relative col-start-4 col-span-2">
            <button
              type="button"
              onClick={() => {
                setOpenSizeSelect((prev) => !prev);
                setOpenColorSelect(false);
                setOpenSortSelect(false);
              }}
              className="flex justify-center items-center gap-x-1 text-sm py-1 capitalize"
            >
              {size && size !== "all" ? size : "Size"}
              <MdKeyboardArrowDown />
            </button>
            {openSizeSelect && (
              <ul className="absolute top-full z-30 min-w-28 bg-[#EEEFF1]">
                {filter.size.map((size) => (
                  <li key={size}>
                    <button
                      type="button"
                      onClick={() => {
                        setSize(size);
                        setOpenSizeSelect(false);
                      }}
                      className="px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                    >
                      {size}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative col-start-6 col-span-2">
            <button
              type="button"
              onClick={() => {
                setOpenColorSelect((prev) => !prev);
                setOpenSizeSelect(false);
                setOpenSortSelect(false);
              }}
              className="flex justify-center items-center gap-x-1 text-sm py-1 capitalize"
            >
              {color && color !== "all" ? color : "Color"}
              <MdKeyboardArrowDown />
            </button>
            {openColorSelect && (
              <ul className="absolute top-full z-30 min-w-28 bg-[#EEEFF1]">
                {filter.color.map((color) => (
                  <li key={color}>
                    {" "}
                    <button
                      type="button"
                      onClick={() => {
                        setColor(color);
                        setOpenColorSelect(false);
                      }}
                      className="px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                    >
                      {color}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative col-start-10 col-span-3">
            <button
              type="button"
              onClick={() => {
                setOpenSortSelect((prev) => !prev);
                setOpenColorSelect(false);
                setOpenSizeSelect(false);
              }}
              className="flex justify-center items-center gap-x-1 text-sm py-1 capitalize"
            >
              {sort && sort !== "no sort" ? sort : "Sort"}
              <MdKeyboardArrowDown />
            </button>
            {openSortSelect && (
              <ul className="absolute top-full z-30 min-w-28 bg-[#EEEFF1]">
                {filter.sort.map((sort) => (
                  <li key={sort}>
                    <button
                      type="button"
                      onClick={() => {
                        setSort(sort);
                        setOpenSortSelect(false);
                      }}
                      className="px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                    >
                      {sort}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="md:col-span-3 relative flex justify-between col-span-12">
          <button
            type="button"
            onClick={() => {
              setOpenCategorySelect((prev) => !prev);
            }}
            className="flex md:hidden justify-center items-center gap-x-1 text-sm py-1"
          >
            Categories
            <MdKeyboardArrowDown />
          </button>
          <div
            className={`${
              openCategorySelect ? "flex" : "hidden"
            } md:flex flex-col items-start max-md:absolute top-full z-30 min-w-28 max-md:bg-[#EEEFF1]`}
          >
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => {
                  setActive(category.id);
                  setOpenColorSelect(false);
                  setOpenSizeSelect(false);
                  setOpenSortSelect(false);
                  setOpenCategorySelect(false);
                }}
                className={`${
                  active === category.id
                    ? "md:text-yellow md:font-semibold md:text-[18px] md:py-1"
                    : "md:text-black md:font-normal md:text-[16px]"
                } capitalize px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left text-[12px] w-full`}
              >
                {category.title}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpenFilter(true)}
            className="md:hidden text-sm py-1 self-end"
          >
            Filter
          </button>
        </div>
        <div className="grid grid-cols-12 col-span-12 md:col-span-9 gap-4 py-1">
          {products.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              className={"col-span-12 sm:col-span-6 md:col-span-4"}
            />
          ))}
        </div>
      </div>
      {openFilter && (
        <FilterPopUp
          openColorSelect={openColorSelect}
          openSizeSelect={openSizeSelect}
          openSortSelect={openSortSelect}
          setOpenColorSelect={setOpenColorSelect}
          setOpenSortSelect={setOpenSortSelect}
          setOpenSizeSelect={setOpenSizeSelect}
          size={size}
          sort={sort}
          color={color}
          setSize={setSize}
          setSort={setSort}
          setColor={setColor}
          setOpenFilter={setOpenFilter}
        />
      )}
    </main>
  );
}
