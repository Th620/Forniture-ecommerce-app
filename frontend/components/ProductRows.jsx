"use client";

import { BASE_URL } from "@/constants";
import { deleteProduct, getProducts } from "@/services/products";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineDelete, MdOutlineModeEdit } from "react-icons/md";

const ProductRows = ({
  searchParams,
  setError,
  setNoProducts,
  setIsLoading,
}) => {
  const [products, setProducts] = useState([]);
  const searchParamsvalues = Object.fromEntries([...searchParams]);

  const router = useRouter();

  const handelGetProducts = async ({
    color,
    size,
    sort,
    category,
    searchKeyword,
  }) => {
    try {
      setIsLoading(true);
      const products = await getProducts({
        color,
        size,
        sort,
        category,
        searchKeyword,
      });

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
      try {
        const fetchProducts = await handelGetProducts(searchParamsvalues);
        if (fetchProducts) {
          if (fetchProducts.length === 0) {
            setNoProducts(true);
            return;
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
    };
  }, [searchParams]);

  const handelDeleteProduct = async (id) => {
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
                  <p className="sm:text-sm text-xs font-semibold">
                    {product?.title}
                  </p>

                  <p className="sm:text-sm text-xs font-semibold block sm:hidden">
                    {/* Qt */}× {product?.price}DZD
                  </p>
                </div>
              </Link>
            </td>
            <td className="text-sm font-semibold min-w-16 max-sm:hidden">
              {product?.price}DZD
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
            <td className="font-semibold table-cell md:w-[8%] min-w-14">
              <button
                type="button"
                onClick={() => {
                  router.push(`/dashboard/products/edit/${product?.slug}`);
                }}
                className="px-1"
              >
                <MdOutlineModeEdit className="size-[18px] text-[#8C8C8C] dark:text-bg" />
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handelDeleteProduct(product?._id);
                }}
                className="px-1"
              >
                <MdOutlineDelete className="size-[18px] text-red-400" />
              </button>
            </td>
          </tr>
        ))}
    </>
  );
};

export default ProductRows;
