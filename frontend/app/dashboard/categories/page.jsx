"use client";

import Loading from "@/app/loading";
import { BASE_URL } from "@/constants";
import { deleteCategory } from "@/services/category";
import { getCategories } from "@/services/category";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineAdd, MdDelete, MdModeEdit, MdOutlineErrorOutline } from "react-icons/md";

export default function Categories() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);

  const handleGetCategories = async () => {
    try {
      setIsLoading(true);
      const categories = await getCategories();
      if (categories) {
        setCategories(categories);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ categories: true, Error: error.message });
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetCategories();
    };
  }, []);

  const handleDeleteCategory = async (id) => {
    try {
      if (confirm("Are you sure you want to delete this category")) {
        setIsLoading(true);
        const responce = await deleteCategory({ id });
        if (responce) {
          await handleGetCategories();
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
        <Loading className={"dash-load max-md:p-0"} />
      ) : (
        <main className="min-h-screen w-full flex flex-col gap-4 bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] pb-5 text-black dark:text-white">
          {error?.categories ? (
            <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
              <MdOutlineErrorOutline className="md:text-lg text-3xl" />
              {error.Error}
            </div>
          ) : (
            <>
              <div className="flex gap-4 pt-5 px-5 items-center justify-end">
                {error && !error?.categories && (
                  <div className="mr-auto w-1/3">
                    <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                      <MdErrorOutline className="size-4" />
                      {error}
                    </div>
                  </div>
                )}
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
                      <th className="font-medium text-start text-sm w-4 md:flex justify-center hidden items-center text-[#8C8C8C] px-5 py-2">
                        #
                      </th>
                      <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 max-sm:w-[20vw] ">
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
                          <td className="text-sm font-semibold min-w-16">
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
                              <MdModeEdit className="size-[18px] text-[#8C8C8C] dark:text-bg" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await handleDeleteCategory(category?._id);
                              }}
                              className="px-1"
                            >
                              <MdDelete className="size-[18px] text-red-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      )}
    </>
  );
}
