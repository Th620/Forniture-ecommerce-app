"use client";

import FilterPopUp from "@/components/FilterPopUp";
import ProductRows from "@/components/productRows";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { HiOutlineFilter } from "react-icons/hi";
import { MdOutlineAdd } from "react-icons/md";

export default function Products() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // const [products, setProducts] = useState([]);
  const [noProducts, setNoProducts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  // const [queries, setQueries] = useState({ color, size, sort, category });

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen w-full bg-white dark:bg-darkBg text-black dark:text-white flex justify-center items-center pt-[60px] md:pl-[20%]">
          {"Loading..."}
        </div>
      ) : (
        <main className="min-h-screen w-full flex flex-col gap-4 bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] pb-5 text-black dark:text-white">
          {openFilter && (
            <FilterPopUp
              setOpenFilter={setOpenFilter}
              setError={setError}
              className={"md:pt-[60px] md:pl-[20%] w-full min-h-screen"}
            />
          )}
          <div className="flex gap-4 pt-5 px-5 items-center justify-end">
            {error && <div>{error.message}</div>}
            <button
              type="button"
              onClick={() => {
                setOpenFilter(true);
              }}
              className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-white transition-colors duration-150 dark:bg-darkBg dark:hover:bg-[#252528] px-4 py-2 rounded-md text-black dark:text-white border border-gray border-opacity-30 dark:border-opacity-5 cursor-pointer"
            >
              <HiOutlineFilter />
              filter
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/products/new")}
              className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-yellow px-4 py-2 rounded-md text-white cursor-pointer"
            >
              <MdOutlineAdd className="size-4" />
              add new product
            </button>
          </div>
          <div className="px-5 pt-4 w-full">
            <table className="w-full text-start table">
              <thead className="w-full">
                <tr className="border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40">
                  <th className="font-medium text-start text-sm text-[#8C8C8C] py-2">
                    Product
                  </th>
                  <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 hidden sm:table-cell">
                    price
                  </th>
                  <th className="font-medium text-start text-sm text-[#8C8C8C] py-2">
                    stock
                  </th>
                  <th className="font-medium text-start text-sm min-w-16 text-[#8C8C8C] py-2 hidden sm:table-cell">
                    colors
                  </th>
                  <th className="font-medium text-start text-sm min-w-16 text-[#8C8C8C] py-2 hidden sm:table-cell">
                    sizes
                  </th>
                </tr>
              </thead>
              <tbody>
                <ProductRows
                  setError={setError}
                  searchParams={searchParams}
                  setNoProducts={setNoProducts}
                  setIsLoading={setIsLoading}
                />
              </tbody>
            </table>
            {noProducts && (
              <div className="w-full py-10 bg-white dark:bg-darkBody text-black dark:text-white flex justify-center items-center">
                {"No Products"}
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
}
