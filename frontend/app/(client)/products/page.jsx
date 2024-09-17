"use client";

import { MdKeyboardArrowDown } from "react-icons/md";
import { useEffect, useState } from "react";
import FilterPopUp from "@/components/FilterPopUp";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories } from "@/services/category";
import Select from "@/components/Select";
import { getProducts } from "@/services/products";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [openCategorySelect, setOpenCategorySelect] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [noProducts, setNoProducts] = useState(false);
  const [openSizeSelect, setOpenSizeSelect] = useState(false);
  const [openColorSelect, setOpenColorSelect] = useState(false);
  const [openSortSelect, setOpenSortSelect] = useState(false);

  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    +searchParams.get("page") || 1
  );
  const [totalPageCount, setTotalPageCount] = useState(0);
  console.log(totalPageCount);

  const [category, setCategory] = useState(
    searchParams.get("category") || "all categories"
  );
  const [size, setSize] = useState(searchParams.get("size") || "");
  const [color, setColor] = useState(searchParams.get("color") || "");
  const [sort, setSort] = useState(
    searchParams.get("sort") === "-1"
      ? "price low to hight"
      : searchParams.get("sort") === "1"
      ? "price hight to low"
      : ""
  );
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const searchParamsvalues = Object.fromEntries([...searchParams]);

  const router = useRouter();

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

  useEffect(() => {
    return async () => {
      const result = await handleGetCategories();

      if (result) {
        setCategories(result);
      }
    };
  }, []);

  const getAvailableColorsAdSizes = async () => {
    try {
      setIsLoading(true);

      const { data } = await getProducts({});

      if (data) {
        const colors = new Set();
        const sizes = new Set();
        data.forEach((product) => {
          product.colors.forEach((color) => {
            colors.add(color);
          });
          product.sizes.forEach((size) => {
            sizes.add(size);
          });
        });
        setColors(Array.from(colors));
        setSizes(Array.from(sizes));
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return async () => {
      await getAvailableColorsAdSizes();
    };
  }, []);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn")) {
        setOpenColorSelect(false);
        setOpenSizeSelect(false);
        setOpenSortSelect(false);
      }
    });
  }, []);

  const [products, setProducts] = useState([]);

  const handleGetProducts = async ({
    color,
    size,
    sort,
    category,
    searchKeyword,
    page,
  }) => {
    try {
      setIsLoading(true);
      const { data, headers } = await getProducts({
        color,
        size,
        sort,
        category,
        searchKeyword,
        pageSize: 16,
        page,
      });

      if (data) {
        if (data.length === 0) {
          setNoProducts(true);
        }
        if (JSON.parse(headers?.get("x-totalpagecount"))) {
          setTotalPageCount(JSON.parse(headers.get("x-totalpagecount")));
        }
        setProducts([...data]);
      } else {
        setNoProducts(true);
      }

      setIsLoading(false);
      return products;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetProducts({
        color: searchParams.get("color"),
        size: searchParams.get("size"),
        sort: searchParams.get("sort"),
        category: searchParams.get("category"),
        searchKeyword: searchParams.get("searchKeyword"),
        page: currentPage,
      });
    };
  }, []);

  return (
    <main className="relative flex flex-col justify-center sm:justify-start gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white mt-150 min-h-screen mb-28">
      <h2 className="text-[32px] font-semibold capitalize">{category}</h2>
      <div className="grid grid-cols-12 gap-x-4 w-full">
        <div className="w-full hidden md:grid grid-cols-12 gap-4 col-span-12">
          <Select
            setOpenSelect={setOpenSizeSelect}
            openSelect={openSizeSelect}
            select={size}
            setSelect={setSize}
            options={["all", ...sizes]}
            label={"size"}
            className={"hover:bg-bg col-span-2 mb-1 col-start-4"}
            btnClassName={"transition-colors hover:bg-bg duration-100"}
            onClick={async (option) => {
              setSize(option);

              setOpenSizeSelect(false);

              if (option !== "all") {
                searchParamsvalues.size = option;
              } else {
                delete searchParamsvalues.size;
              }
              router.replace(
                `/products?${new URLSearchParams(searchParamsvalues)}`
              );
              try {
                await handleGetProducts({
                  color: searchParams.get("color"),
                  size: option === "all" ? "" : option,
                  sort: searchParams.get("sort"),
                  category: searchParams.get("category"),
                  searchKeyword: searchParams.get("searchKeyword"),
                  page: currentPage,
                });
              } catch (error) {
                setError(error.message);
                console.log(error);
              }
            }}
            addFn={() => {
              setOpenColorSelect(false);
              setOpenCategorySelect(false);
              setOpenSortSelect(false);
            }}
          />
          <Select
            setOpenSelect={setOpenColorSelect}
            openSelect={openColorSelect}
            select={color}
            setSelect={setColor}
            options={["all", ...colors]}
            label={"color"}
            className={"hover:bg-bg col-span-2 mb-1 col-start-6"}
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
                `/products?${new URLSearchParams(searchParamsvalues)}`
              );
              try {
                await handleGetProducts({
                  color: option === "all" ? "" : option,
                  size: searchParams.get("size"),
                  sort: searchParams.get("sort"),
                  category: searchParams.get("category"),
                  searchKeyword: searchParams.get("searchKeyword"),
                  page: currentPage,
                });
              } catch (error) {
                setError(error.message);
              }
            }}
            addFn={() => {
              setOpenCategorySelect(false);
              setOpenSizeSelect(false);
              setOpenSortSelect(false);
            }}
          />
          <Select
            setOpenSelect={setOpenSortSelect}
            openSelect={openSortSelect}
            select={sort}
            setSelect={setSort}
            options={["no sort", "price low to hight", "price hight to low"]}
            label={"sort"}
            className={
              "hover:bg-bg col-span-3 mb-1 col-start-10 dark:bg-darkBg"
            }
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
                `/products?${new URLSearchParams(searchParamsvalues)}`
              );
              try {
                await handleGetProducts({
                  color: searchParams.get("color"),
                  size: searchParams.get("size"),
                  sort:
                    option === "price low to hight" || option === "no sort"
                      ? "-1"
                      : "1",
                  category: searchParams.get("category"),
                  searchKeyword: searchParams.get("searchKeyword"),
                  page: currentPage,
                });
              } catch (error) {
                setError(error.message);
              }
            }}
            addFn={() => {
              setOpenColorSelect(false);
              setOpenCategorySelect(false);
              setOpenSizeSelect(false);
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
            } md:flex flex-col items-start max-md:absolute top-full z-40 min-w-28 max-md:bg-[#EEEFF1]`}
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
                    `/products?${new URLSearchParams(searchParamsvalues)}`
                  );
                  try {
                    await handleGetProducts({
                      color: searchParams.get("color"),
                      size: searchParams.get("size"),
                      sort: searchParams.get("sort"),
                      category: item === "all categories" ? "" : item,
                      searchKeyword: searchParams.get("searchKeyword"),
                      page: currentPage,
                    });
                  } catch (error) {
                    setError(error.message);
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
        <div className="grid grid-cols-12 col-span-12 md:col-span-9 gap-4 py-1">
          {products.map((product) => (
            <ProductCard
              product={product}
              key={product._id}
              className={"col-span-12 sm:col-span-6 md:col-span-3"}
              soldOut={product?.stock === 0}
              onSale={product?.onSale && product?.stock !== 0}
            />
          ))}
          {products?.length === 0 && (
            <div className="col-span-12 h-20 flex justify-center items-center font-semibold text-black text-opacity-30 capitalize">
              No products
            </div>
          )}
        </div>
        <div className="col-span-9 col-start-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPageCount={totalPageCount}
            onPageChange={async (page) => {
              setCurrentPage(page);
              router.replace(
                `http://localhost:3000/products?${new URLSearchParams({
                  ...searchParamsvalues,
                  page,
                })}`
              );
              await handleGetProducts({
                ...searchParamsvalues,
                page,
              });
            }}
          />
        </div>
      </div>
      {openFilter && (
        <FilterPopUp
          setOpenFilter={setOpenFilter}
          className={"w-full min-h-screen"}
          setError={setError}
        />
      )}
    </main>
  );
}
