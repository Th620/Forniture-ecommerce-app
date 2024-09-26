"use client";

import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { useRouter } from "next/navigation";
import { getCategories } from "@/services/category";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleGetCategories = async () => {
    try {
      const data = await getCategories();
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetCategories();
    };
  }, []);

  return (
    <section className="flex flex-col px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white py-14">
      <h2 className="text-center text-[32px] font-semibold">Categories</h2>
      <button
        type="button"
        onClick={() => router.push("/categories", { scroll: true })}
        className="md:self-end capitalize md:text-xs text-gray md:underline md:font-medium md:p-0 md:border-none font-semibold border border-gray self-center px-8 rounded-sm py-2 max-md:order-last mt-14"
      >
        show all
      </button>
      {error ? (
        <div className="w-full py-14 text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 px-5 md:px-10">
          <MdOutlineErrorOutline className="md:text-lg text-3xl" />
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-x-4 gap-y-4 py-1">
          {categories.slice(0, 4).map((category) => (
            <CategoryCard
              category={category}
              key={category?._id}
              onClick={() =>
                router.push(
                  `/products?category=${category?.name?.toLowerCase()}`,
                  { scroll: true }
                )
              }
              className={"col-span-12 sm:col-span-6 md:col-span-3 "}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
