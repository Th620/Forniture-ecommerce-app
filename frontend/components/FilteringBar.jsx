"use client";

import { getProducts } from "@/services/products";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "./Select";

const FilteringBar = ({ setIsLoading, setError }) => {
  const [openSizeSelect, setOpenSizeSelect] = useState(false);
  const [openColorSelect, setOpenColorSelect] = useState(false);
  const [openSortSelect, setOpenSortSelect] = useState(false);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sort, setSort] = useState("");
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sorts, setSorts] = useState([]);

  const router = useRouter();

  // const [queries, setQueries] = useState({});

  const getAvailableColorsAdSizes = async () => {
    try {
      setIsLoading(true);

      const products = await getProducts({});

      if (products) {
        const colors = new Set();
        const sizes = new Set();
        products.forEach((product) => {
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

  // useEffect(() => {
  //   return () => {
  //     // if (size && size.toLowerCase() !== "all") {
  //     //   setQueries({ ...queries, size: size });
  //     // }
  //     // if (color && color.toLowerCase() !== "all") {
  //     //   setQueries({ ...queries, color: color });
  //     // }
  //     // if (sort && sort.toLowerCase() !== "no sort") {
  //     //   setQueries({ ...queries, sort: sort });
  //     // }

  //     router.push(`?${new URLSearchParams(queries)}`);
  //   };
  // }, [queries, size, color, sort]);

  return (
    <div className="w-full hidden md:grid grid-cols-12 gap-4 col-span-12">
      <Select
        setOpenSelect={setOpenSizeSelect}
        openSelect={openSizeSelect}
        select={size}
        setSelect={setSize}
        options={["all", ...sizes]}
        label={"size"}
        className={"hover:bg-bg col-span-2 col-start-4"}
        btnClassName={"transition-colors hover:bg-bg duration-100"}
        func={(colorRef, sizeRef, sortRef) => {
          router.push(
            `/products${
              sizeRef !== "all" ||
              (color && color.toLowerCase() !== "all") ||
              (sort && sort.toLowerCase() !== "no sort")
                ? `?`
                : ""
            }${sizeRef !== "all" && `size=${sizeRef}`}${
              color && color.toLowerCase() !== "all" && `&color=${color}`
            }${
              sort &&
              sort.toLowerCase() !== "no sort" &&
              `&sort=${sort.replace(/\s/g, "+")}`
            }`, { scroll: true}
          );
        }}
      />
      <Select
        setOpenSelect={setOpenColorSelect}
        openSelect={openColorSelect}
        select={color}
        setSelect={setColor}
        options={["all", ...colors]}
        label={"color"}
        className={"hover:bg-bg col-span-2 col-start-6"}
        btnClassName={"transition-colors hover:bg-bg duration-100"}
        func={(colorRef, sizeRef, sortRef) => {
          router.push(
            `/products${
              colorRef !== "all" ||
              (size && size.toLowerCase() !== "all") ||
              (sort && sort.toLowerCase() !== "no sort")
                ? `?`
                : ""
            }${colorRef !== "all" && `color=${colorRef}`}${
              size && size.toLowerCase() !== "all" && `&size=${size}`
            }${
              sort &&
              sort.toLowerCase() !== "no sort" &&
              `&sort=${sort.replace(/\s/g, "+")}`
            }`, { scroll: true}
          );
        }}
      />
      <Select
        setOpenSelect={setOpenSortSelect}
        openSelect={openSortSelect}
        select={sort}
        setSelect={setSort}
        options={["no sort", "price low to hight", "price hight to low"]}
        label={"sort"}
        className={"hover:bg-bg col-span-2 col-start-11 dark:bg-darkBg"}
        btnClassName={" hover:bg-bg transition-colors duration-100"}
        func={(colorRef, sizeRef, sortRef) => {
          router.push(
            `/products${
              sortRef !== "no sort" ||
              (color && color.toLowerCase() !== "all") ||
              (size && size.toLowerCase() !== "all")
                ? `?`
                : ""
            }${sortRef !== "all" && `sort=${sortRef.replace(/\s/g, "+")}`}${
              color && color.toLowerCase() !== "all" && `&color=${color}`
            }${size && size.toLowerCase() !== "all" && `&size=${size}`}`, { scroll: true}
          );
        }}
      />
    </div>
  );
};

export default FilteringBar;
