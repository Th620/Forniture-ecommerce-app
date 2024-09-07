"use client";

import { BASE_URL } from "@/constants";
import { deleteCategory } from "@/services/category";
import { getCategories } from "@/services/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdOutlineAdd,
  MdOutlineDelete,
  MdOutlineModeEdit,
} from "react-icons/md";

export default function Categories() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [categories, setCategories] = useState([]);

  const handelGetCategories = async () => {
    try {
      setIsLoading(true);
      const categories = await getCategories();
      if (categories) {
        setCategories(categories);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    return async () => {
      await handelGetCategories();
    };
  }, []);

  const handelDeleteCategory = async (id) => {

    try {
      if (confirm("Are you sure you want to delete this category")) {
        setIsLoading(true);
        const responce = await deleteCategory({ id });
        if (responce) {
          await handelGetCategories();
        }
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
        <div className="min-h-screen w-full bg-white dark:bg-darkBg text-black dark:text-white flex justify-center items-center pt-[60px] md:pl-[20%]">
          {"Loading..."}
        </div>
      ) : (
        <main className="min-h-screen w-full flex flex-col gap-4 bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] pb-5 text-black dark:text-white">
          <div className="flex gap-4 pt-5 px-5 items-center justify-end">
            {error && <div>{error.message}</div>}
            <button
              type="button"
              onClick={() => router.push("/dashboard/categories/new")}
              className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-yellow px-4 py-2 rounded-md text-white cursor-pointer"
            >
              <MdOutlineAdd className="size-4" />
              add new category
            </button>
          </div>
          <div className="px-5 pt-4 w-full">
            <table className="w-full text-start table">
              <thead className="w-full">
                <tr className="border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40">
                  <th className="font-medium text-start text-sm w-4 flex justify-center items-center text-[#8C8C8C] px-5 py-2">
                    #
                  </th>
                  <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 ">
                    image
                  </th>
                  <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 ">
                    category
                  </th>
                  <th className="font-medium text-start text-sm text-[#8C8C8C] py-2">
                    products
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 &&
                  categories.map((category, index) => (
                    <tr
                      key={category?._id}
                      className="border-b-2 border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 h-fit"
                    >
                      <td className="text-sm font-semibold w-4 min-w-24 table-cell px-5 max-sm:hidden ">
                        {index + 1}
                      </td>
                      <td className="py-2 max-h-[30vw] w-[10vw] table-cell">
                        <Link
                          href={`/dashboard/categories/${category?.slug}`}
                          className="flex gap-x-4 h-full items-center"
                        >
                          <div className="relative aspect-[1/1.2] sm:min-h-[10vh] min-h-[7vh] text-xs bg-white dark:bg-black">
                            <Image
                              src={
                                category?.image
                                  ? BASE_URL + category?.image
                                  : "/lamp.png"
                              }
                              layout="fill"
                              objectFit="cover"
                              alt={category?.name}
                            />
                          </div>
                        </Link>
                      </td>
                      <td className="text-sm font-semibold min-w-16 max-sm:hidden">
                        {category?.name}
                      </td>
                      <td className="text-sm font-semibold min-w-16">
                        <Link
                          href={`/dashboard/products?category=${category?.name}`}
                          className="w-fit h-fit"
                        >
                          {category?.products?.length}
                        </Link>
                      </td>

                      <td className="font-semibold table-cell md:w-[8%] min-w-14">
                        <button
                          type="button"
                          onClick={() => {
                            router.push(
                              `/dashboard/categories/edit/${category?.slug}`
                            );
                          }}
                          className="px-1"
                        >
                          <MdOutlineModeEdit className="size-[18px] text-[#8C8C8C] dark:text-bg" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await handelDeleteCategory(category?._id);
                          }}
                          className="px-1"
                        >
                          <MdOutlineDelete className="size-[18px] text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </main>
      )}
    </>
  );
}
