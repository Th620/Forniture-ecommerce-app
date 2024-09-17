"use client";

import { BASE_URL } from "@/constants";
import { deleteProduct, getProducts } from "@/services/products";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdDelete,
  MdModeEdit,
  MdDiscount,
  MdOutlineDiscount,
} from "react-icons/md";
import Pagination from "./Pagination";

const ProductRows = ({
  searchParams,
  setError,
  setNoProducts,
  setIsLoading,
  setSlug,
  setOpenSalePrice,
}) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    +searchParams.get("page") || 1
  );
  const [totalPageCount, setTotalPageCount] = useState(0);

  const searchParamsvalues = Object.fromEntries([...searchParams]);

  const router = useRouter();

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
        pageSize: 5,
        page,
      });

      if (data) {
        if (data?.length === 0) {
          setNoProducts(true);
          return;
        }
        if (JSON.parse(headers?.get("x-totalpagecount"))) {
          setTotalPageCount(JSON.parse(headers.get("x-totalpagecount")));
        }
        setNoProducts(false);
        setProducts([...data]);
      } else {
        setNoProducts(true);
      }

      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetProducts(searchParamsvalues);
    };
  }, [searchParams]);

  const handleDeleteProduct = async (id) => {
    try {
      if (confirm("Are you sure you want to delete this product")) {
        setIsLoading(true);
        await deleteProduct({ id });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error.message);

      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      {products.length > 0 &&
        products.map((product) => (
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
                    {product?.onSale ? product?.salePrice : product?.price} DZD
                  </p>
                </div>
              </Link>
            </td>
            <td className="text-sm font-semibold min-w-16 max-sm:hidden">
              {product?.onSale ? product?.salePrice : product?.price} DZD
            </td>
            <td className="text-sm font-semibold min-w-16">{product?.stock}</td>
            <td className="text-xs font-semibold min-w-16 max-sm:hidden">
              {product?.colors.length <= 4
                ? product?.colors.map((item) => (
                    <p className="font-medium">{item}</p>
                  ))
                : [
                    product?.colors[0],
                    product?.colors[1],
                    product?.colors[2],
                    product?.colors[3],
                    "...",
                  ].map((item) => <p className="font-medium">{item}</p>)}
            </td>
            <td className="text-xs font-semibold min-w-16 max-sm:hidden">
              {product?.sizes.map((item) => (
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
                  router.push(`/dashboard/products/edit/${product?.slug}`);
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
              currentPage={currentPage}
              totalPageCount={totalPageCount}
              onPageChange={(page) => {
                setCurrentPage(page);
                router.replace(
                  `/dashboard/products?${new URLSearchParams({
                    ...searchParamsvalues,
                    page,
                  })}`
                );
              }}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default ProductRows;
