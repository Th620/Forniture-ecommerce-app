"use client";

import { useEffect, useState } from "react";
import Select from "./Select";
import { MdKeyboardArrowDown } from "react-icons/md";

const FilteringContainer = ({
  children,
  openCategorySelect,
  openColorSelect,
  openSizeSelect,
  openSortSelect,
  category,
  categories,
  colors,
  sizes,
  setOpenSortSelect,
  setOpenSizeSelect,
  setOpenColorSelect,
  setOpenCategorySelect,
  color,
  size,
  sort,
  setColor,
  setSize,
  setSort,
  setCategory,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const bar = document.getElementById("container");
    const handleScroll = () => {
      const scrollTop = bar.getBoundingClientRect().top;
      if (scrollTop <= 96) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.addEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`grid grid-cols-12 gap-x-4 w-full ${
        scrolled
          ? "fixed top-[60px] right-10 md:right-75 lg:right-150"
          : "relative"
      }`}
    >
      <div
        id="filtering"
        className={`w-full hidden md:grid grid-cols-12 gap-4 col-span-9 col-start-4 bg-white z-20 `}
      >
        <Select
          setOpenSelect={setOpenSizeSelect}
          openSelect={openSizeSelect}
          select={size}
          setSelect={setSize}
          options={["all", ...sizes]}
          label={"size"}
          className={"hover:bg-bg col-span-3 mb-1"}
          btnClassName={"transition-colors hover:bg-bg duration-100"}
          onClick={async (option) => {
            setSize(option);
            setOpenColorSelect(false);
            setOpenCategorySelect(false);
            setOpenSizeSelect(false);
            setOpenSortSelect(false);
            if (option !== "all") {
              searchParamsvalues.size = option;
            } else {
              delete searchParamsvalues.size;
            }
            router.replace(
              `/products?${new URLSearchParams(searchParamsvalues)}`,
              { scroll: true}
            );
            try {
              const fetchProducts = await handleGetProducts({
                color: searchParams.get("color"),
                size: option === "all" ? "" : option,
                sort: searchParams.get("sort"),
                category: searchParams.get("category"),
                searchKeyword: searchParams.get("searchKeyword"),
              });

              if (fetchProducts) {
                if (fetchProducts.length === 0) {
                  setNoProducts(true);
                }
                setNoProducts(false);
                setProducts([...fetchProducts]);
              } else {
                setNoProducts(true);
              }
            } catch (error) {
              setError(error.message);
              console.log(error);
            }
          }}
        />
        <Select
          setOpenSelect={setOpenColorSelect}
          openSelect={openColorSelect}
          select={color}
          setSelect={setColor}
          options={["all", ...colors]}
          label={"color"}
          className={"hover:bg-bg col-span-3 mb-1 col-start-4"}
          btnClassName={"transition-colors hover:bg-bg duration-100"}
          onClick={async (option) => {
            setColor(option);
            setOpenColorSelect(false);
            setOpenCategorySelect(false);
            setOpenSizeSelect(false);
            setOpenSortSelect(false);
            if (option !== "all") {
              searchParamsvalues.color = option;
            } else {
              delete searchParamsvalues.color;
            }
            router.replace(
              `/products?${new URLSearchParams(searchParamsvalues)}`,
              { scroll: true}
            );
            try {
              const fetchProducts = await handleGetProducts({
                color: option === "all" ? "" : option,
                size: searchParams.get("size"),
                sort: searchParams.get("sort"),
                category: searchParams.get("category"),
                searchKeyword: searchParams.get("searchKeyword"),
              });

              if (fetchProducts) {
                if (fetchProducts.length === 0) {
                  setNoProducts(true);
                }
                setNoProducts(false);
                setProducts([...fetchProducts]);
              } else {
                setNoProducts(true);
              }
            } catch (error) {
              setError(error.message);
              console.log(error);
            }
          }}
        />
        <Select
          setOpenSelect={setOpenSortSelect}
          openSelect={openSortSelect}
          select={sort}
          setSelect={setSort}
          options={["no sort", "price low to hight", "price hight to low"]}
          label={"sort"}
          className={"hover:bg-bg col-span-3 mb-1 col-start-10 dark:bg-darkBg"}
          btnClassName={" hover:bg-bg transition-colors duration-100"}
          onClick={async (option) => {
            setSort(option);
            setOpenColorSelect(false);
            setOpenCategorySelect(false);
            setOpenSizeSelect(false);
            setOpenSortSelect(false);
            if (option !== "no sort") {
              searchParamsvalues.sort =
                option === "price low to hight" ? "-1" : "1";
            } else {
              delete searchParamsvalues.sort;
            }
            router.replace(
              `/products?${new URLSearchParams(searchParamsvalues)}`,
              { scroll: true}
            );
            try {
              const fetchProducts = await handleGetProducts({
                color: searchParams.get("color"),
                size: searchParams.get("size"),
                sort:
                  option === "price low to hight" || option === "no sort"
                    ? "-1"
                    : "1",
                category: searchParams.get("category"),
                searchKeyword: searchParams.get("searchKeyword"),
              });

              if (fetchProducts) {
                if (fetchProducts.length === 0) {
                  setNoProducts(true);
                }
                setNoProducts(false);
                setProducts([...fetchProducts]);
              } else {
                setNoProducts(true);
              }
            } catch (error) {
              setError(error.message);
              console.log(error);
            }
          }}
        />
      </div>

      <div className="md:col-span-3 relative flex justify-between col-span-12">
        <button
          type="button"
          onClick={() => {
            setOpenCategorySelect((prev) => !prev);
          }}
          className="btn flex md:hidden justify-center items-center gap-x-1 text-sm py-1 font-medium"
        >
          Categories
          <MdKeyboardArrowDown />
        </button>
        <div
          className={`${
            openCategorySelect ? "flex" : "hidden"
          } md:flex flex-col items-start max-md:absolute top-full z-10 min-w-28 max-md:bg-[#EEEFF1]`}
        >
          {["all categories", ...categories].map((item) => (
            <button
              type="button"
              key={item}
              onClick={async () => {
                setCategory(item);
                if (item !== "all categories") {
                  searchParamsvalues.category = item;
                } else {
                  delete searchParamsvalues.category;
                }
                setOpenCategorySelect(false);
                router.replace(
                  `/products?${new URLSearchParams(searchParamsvalues)}`,
                  { scroll: true}
                );
                try {
                  const fetchProducts = await handleGetProducts({
                    color: searchParams.get("color"),
                    size: searchParams.get("size"),
                    sort: searchParams.get("sort"),
                    category: item === "all categories" ? "" : item,
                    searchKeyword: searchParams.get("searchKeyword"),
                  });

                  if (fetchProducts) {
                    if (fetchProducts.length === 0) {
                      setNoProducts(true);
                    }
                    setProducts([...fetchProducts]);
                  } else {
                    setNoProducts(true);
                  }
                } catch (error) {
                  setError(error.message);
                  console.log(error);
                }
              }}
              className={`${
                item === category
                  ? "md:text-yellow md:font-semibold md:text-[18px] md:py-1"
                  : "md:text-black md:font-medium md:text-[16px]"
              } btn capitalize px-2 py-1 max-md:hover:bg-[#E2E3E5] transition-colors duration-100 text-left text-[12px] w-full`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpenFilter(true)}
          className="md:hidden text-sm py-1 self-end font-medium"
        >
          Filter
        </button>
      </div>

      <div
        id="container"
        className="grid grid-cols-12 col-span-12 md:col-span-9 gap-4 py-1"
      >
        {children}
      </div>
    </div>
  );
};

export default FilteringContainer;
