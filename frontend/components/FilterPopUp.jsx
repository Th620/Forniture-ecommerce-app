"use client";

import { useEffect, useState } from "react";
import Select from "./Select";
import { useRouter } from "next/navigation";
import { getCategories } from "@/services/category";
import { getProducts } from "@/services/products";
import { MdErrorOutline } from "react-icons/md";

const FilterPopUp = ({
  className,
  setOpenFilter,
  handler = async (h) => {},
}) => {
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("");
  const [color, setColor] = useState("");
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openCategorySelect, setOpenCategorySelect] = useState(false);
  const [openSizeSelect, setOpenSizeSelect] = useState(false);
  const [openSortSelect, setOpenSortSelect] = useState(false);
  const [openColorSelect, setOpenColorSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  let queries = {};

  const handleGetCategories = async () => {
    try {
      setIsLoading(true);
      const categories = await getCategories();
      let cat = [];
      if (categories) {
        categories.forEach((category) => {
          cat.push(category.name);
        });
      }
      setIsLoading(false);
      return cat;
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const getAvailableColorsAdSizes = async () => {
    try {
      setIsLoading(true);

      const products = await getProducts({});

      if (products?.data) {
        const colors = new Set();
        const sizes = new Set();
        products?.data?.forEach((product) => {
          product?.colors?.forEach((color) => {
            colors.add(color);
          });
          product?.sizes?.forEach((size) => {
            sizes.add(size);
          });
        });
        setColors(Array.from(colors));
        setSizes(Array.from(sizes));
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);

      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  useEffect(() => {
    return async () => {
      const result = await handleGetCategories();

      if (result) {
        setCategories(result);
      }

      await getAvailableColorsAdSizes();
    };
  }, []);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn")) {
        setOpenCategorySelect(false);
        setOpenColorSelect(false);
        setOpenSizeSelect(false);
      }
    });
  }, []);

  const filterFn = async () => {
    if (size && size.toLowerCase() !== "all") {
      queries.size = size;
    }
    if (color && color.toLowerCase() !== "all") {
      queries.color = color;
    }
    if (sort && sort.toLowerCase() !== "no sort") {
      queries.sort = sort;
    }
    if (category && category.toLowerCase() !== "all") {
      queries.category = category;
    }
    router.push(`?${new URLSearchParams(queries)}`);
    await handler(queries);
    setOpenFilter(false);
  };

  return (
    <div
      className={`${className} fixed z-40 bg-[#282828b1] top-0 left-0 flex items-center justify-center font-montserrat`}
    >
      <div
        className={`dark:bg-darkBg  w-3/4 md:w-1/3 rounded-sm bg-white flex flex-col justify-center px-8 py-6 gap-y-5`}
      >
        {error && (
          <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
            <MdErrorOutline className="size-4" />
            {error?.Error}
          </div>
        )}
        <Select
          setOpenSelect={setOpenCategorySelect}
          openSelect={openCategorySelect}
          select={category}
          setSelect={setCategory}
          options={isLoading ? ["...loading"] : ["all", ...categories]}
          label={"category"}
          className={"hover:bg-bg dark:hover:bg-darkHover dark:bg-darkBg"}
          btnClassName={
            "dark:bg-darkBg dark:hover:bg-[#242427] transition-colors duration-100"
          }
          addFn={() => {
            setOpenColorSelect(false);
            setOpenSizeSelect(false);
            setOpenSortSelect(false);
          }}
        />
        <Select
          setOpenSelect={setOpenColorSelect}
          openSelect={openColorSelect}
          select={color}
          setSelect={setColor}
          options={isLoading ? ["...loading"] : ["all", ...colors]}
          label={"color"}
          className={"hover:bg-bg dark:hover:bg-darkHover dark:bg-darkBg"}
          btnClassName={
            "dark:bg-darkBg dark:hover:bg-[#242427] transition-colors duration-100"
          }
          addFn={() => {
            setOpenCategorySelect(false);
            setOpenSizeSelect(false);
            setOpenSortSelect(false);
          }}
        />
        <Select
          setOpenSelect={setOpenSizeSelect}
          openSelect={openSizeSelect}
          select={size}
          setSelect={setSize}
          options={isLoading ? ["...loading"] : ["all", ...sizes]}
          label={"size"}
          className={"hover:bg-bg dark:hover:bg-darkHover dark:bg-darkBg"}
          btnClassName={
            "dark:bg-darkBg dark:hover:bg-[#242427] transition-colors duration-100"
          }
          addFn={() => {
            setOpenColorSelect(false);
            setOpenCategorySelect(false);
            setOpenSortSelect(false);
          }}
        />
        <Select
          setOpenSelect={setOpenSortSelect}
          openSelect={openSortSelect}
          select={sort}
          setSelect={setSort}
          options={
            isLoading
              ? ["...loading"]
              : ["no sort", "price low to hight", "price hight to low"]
          }
          label={"sort"}
          className={"hover:bg-bg dark:hover:bg-darkHover dark:bg-darkBg"}
          btnClassName={
            "dark:bg-darkBg dark:hover:bg-[#242427] transition-colors duration-100"
          }
          onClick={(option) => {
            if (option === "price low to hight") {
              setSort("-1");
            } else {
              setSort("1");
            }
            setOpenSortSelect(false);
          }}
          addFn={() => {
            setOpenColorSelect(false);
            setOpenSizeSelect(false);
            setOpenCategorySelect(false);
          }}
        />
        <button
          type="button"
          onClick={filterFn}
          className="py-2 px-8 rounded-sm self-center sm:self-end bg-navy hover:bg-navyHover font-lato text-white w-fit font-medium text-sm"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPopUp;
