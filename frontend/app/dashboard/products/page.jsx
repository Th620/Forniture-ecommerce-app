"use client";

import Loading from "@/app/loading";
import FilterPopUp from "@/components/FilterPopUp";
import Pagination from "@/components/Pagination";
import SalePricePopUp from "@/components/SalePricePopUp";
import { BASE_URL } from "@/constants";
import { deleteProduct, getProducts } from "@/services/products";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineFilter } from "react-icons/hi";
import {
  MdDelete,
  MdDiscount,
  MdErrorOutline,
  MdModeEdit,
  MdOutlineAdd,
  MdOutlineDiscount,
  MdOutlineErrorOutline,
} from "react-icons/md";

export default function Products() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [openSalePrice, setOpenSalePrice] = useState(false);
  const [salePrice, setSalePrice] = useState();
  const [slug, setSlug] = useState();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    +searchParams.get("page") || 1
  );
  const [totalPageCount, setTotalPageCount] = useState(0);

  const searchParamsvalues = Object.fromEntries([...searchParams]);

  const handleGetProducts = async ({
    color,
    size,
    sort,
    category,
    page,
    search,
  }) => {
    try {
      setIsLoading(true);
      const { data, headers } = await getProducts({
        color,
        size,
        sort,
        category,
        searchKeyword: search,
        pageSize: 5,
        page,
      });

      if (data) {
        if (
          headers?.get("x-totalpagecount") &&
          JSON.parse(headers?.get("x-totalpagecount"))
        ) {
          setTotalPageCount(JSON.parse(headers.get("x-totalpagecount")));
        } else {
        }
        setProducts([...data]);
      } else {
        setTotalPageCount(0);
      }
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      setError({ products: true, Error: error.message });
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetProducts(searchParamsvalues);
    };
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      if (confirm("Are you sure you want to delete this product")) {
        setIsLoading(true);
        await deleteProduct({ id });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading className={"dash-load max-md:p-0"} />
      ) : (
        <main className="min-h-screen w-full flex flex-col gap-4 bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] pb-5 text-black dark:text-white">
          {openFilter && (
            <FilterPopUp
              setOpenFilter={setOpenFilter}
              setError={setError}
              handler={async (e) => await handleGetProducts(e)}
              className={"md:pt-[60px] md:pl-[20%] w-full min-h-screen"}
            />
          )}
          {openSalePrice && (
            <SalePricePopUp
              error={error}
              setError={setError}
              salePrice={salePrice}
              setSalePrice={setSalePrice}
              setOpenSalePrice={setOpenSalePrice}
              setIsLoading={setIsLoading}
              slug={slug}
              handler={async (e) => await handleGetProducts(e)}
              label={"Set slale price"}
            />
          )}
          <div className="flex gap-4 pt-5 px-5 items-center justify-end">
            {error && !error?.products && (
              <div className="mr-auto w-1/3">
                <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                  <MdErrorOutline className="size-4" />
                  {error.Error}
                </div>
              </div>
            )}
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
              onClick={() =>
                router.push("/dashboard/products/new", { scroll: true})
              }
              className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-yellow px-4 py-2 rounded-md text-white cursor-pointer"
            >
              <MdOutlineAdd className="size-4" />
              add new product
            </button>
          </div>
          {error?.products ? (
            <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
              <MdOutlineErrorOutline className="md:text-lg text-3xl" />
              {error.Error}
            </div>
          ) : (
            <div className="px-5 w-full">
              <table className="w-full text-start table">
                <thead className="w-full">
                  <tr className="border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 capitalize">
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
                  {products.length > 0 &&
                    products?.map((product) => (
                      <tr
                        key={product?._id}
                        className="border-b-2 border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 h-fit"
                      >
                        <td className="py-2 max-h-[30vw]">
                          <Link
                            href={`/dashboard/products/${product?.slug}`}
                            className="flex gap-x-4 h-full items-center"
                          >
                            <div className="relative aspect-[1/1.2] sm:min-h-[10vh] min-h-[7vh] text-xs bg-white dark:bg-black">
                              <Image
                                src={
                                  product?.images[0]
                                    ? BASE_URL + product?.images[0]
                                    : "/lamp.png"
                                }
                                layout="fill"
                                objectFit="cover"
                                alt={product?.title}
                              />
                            </div>
                            <div>
                              <p className="sm:text-sm text-xs font-semibold capitalize">
                                {product?.title}
                              </p>

                              <p className="sm:text-sm text-xs font-semibold block sm:hidden">
                                {product?.onSale
                                  ? product?.salePrice
                                  : product?.price}{" "}
                                DZD
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="text-sm font-semibold min-w-16 max-sm:hidden">
                          {product?.onSale
                            ? product?.salePrice
                            : product?.price}{" "}
                          DZD
                        </td>
                        <td className="text-sm font-semibold min-w-16">
                          {product?.stock}
                        </td>
                        <td className="text-xs font-semibold min-w-16 max-sm:hidden">
                          {product?.colors?.length <= 4
                            ? product?.colors?.map((item) => (
                                <p className="font-medium">{item}</p>
                              ))
                            : [
                                product?.colors[0],
                                product?.colors[1],
                                product?.colors[2],
                                product?.colors[3],
                                "...",
                              ].map((item) => (
                                <p className="font-medium">{item}</p>
                              ))}
                        </td>
                        <td className="text-xs font-semibold min-w-16 max-sm:hidden">
                          {product?.sizes?.map((item) => (
                            <p className="font-medium">{item}</p>
                          ))}
                        </td>
                        <td className="font-semibold table-cell md:w-[12%] min-w-14">
                          <button
                            type="button"
                            onClick={() => {
                              if (!product?.onSale) {
                                setSlug(product?.slug);
                                setOpenSalePrice(true);
                              }
                            }}
                            disabled={product?.onSale}
                            className="px-1"
                          >
                            <abbr title={product?.onSale ? "" : "On Sale"}>
                              {product?.onSale ? (
                                <MdDiscount
                                  className={`size-[18px] text-[#8C8C8C] dark:text-bg `}
                                />
                              ) : (
                                <MdOutlineDiscount
                                  className={`size-[18px] text-[#8C8C8C] dark:text-bg `}
                                />
                              )}
                            </abbr>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              router.push(
                                `/dashboard/products/edit/${product?.slug}`,
                                { scroll: true}
                              );
                            }}
                            className="px-1"
                          >
                            <MdModeEdit className="size-[18px] text-[#8C8C8C] dark:text-bg" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await handleDeleteProduct(product?._id);
                            }}
                            className="px-1"
                          >
                            <MdDelete className="size-[18px] text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td colSpan={6} className="table-cell">
                      <div className="w-full flex justify-center">
                        <Pagination
                          className={"mt-8 mb-3"}
                          currentPage={currentPage}
                          totalPageCount={totalPageCount}
                          onPageChange={async (page) => {
                            setCurrentPage(page);
                            router.replace(
                              `/dashboard/products?${new URLSearchParams({
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
                    </td>
                  </tr>
                </tbody>
              </table>
              {(!products || products?.length === 0) && (
                <div className="w-full py-10 bg-bg text-opacity-50 dark:text-opacity-50 dark:bg-darkBody text-black dark:text-white flex justify-center items-center">
                  {"No Products"}
                </div>
              )}
            </div>
          )}
        </main>
      )}
    </>
  );
}
