"use client";

import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { useRouter } from "next/navigation";
import { getCategories } from "@/services/category";

const categories = [
  {
    id: 1,
    title: "chairs",
  },
  {
    id: 2,
    title: "sofas",
  },
  {
    id: 3,
    title: "lamps",
  },
  {
    id: 4,
    title: "chair",
  },
  {
    id: 5,
    title: "chair",
  },
  {
    id: 6,
    title: "chair",
  },
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);

  const router = useRouter();

  console.log(categories);

  const handleGetCategories = async () => {
    try {
      const data = await getCategories();
      if (data) {
        setCategories(data);
      }
    } catch (error) {}
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
        onClick={() => router.push("/categories")}
        className="md:self-end capitalize md:text-xs text-gray md:underline md:font-medium md:p-0 md:border-none font-semibold border border-gray self-center px-8 rounded-sm py-2 max-md:order-last mt-14"
      >
        show all
      </button>
      <div className="grid grid-cols-12 gap-x-4 gap-y-4 py-1">
        {categories.slice(0, 4).map((category) => (
          <CategoryCard
            category={category}
            key={category?._id}
            onClick={() =>
              router.push(`/products?category=${category?.name?.toLowerCase()}`)
            }
            className={"col-span-12 sm:col-span-6 md:col-span-3 "}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
