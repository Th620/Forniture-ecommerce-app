"use client";

import CategoryCard from "@/components/CategoryCard";
import { getCategories } from "@/services/category";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleGetCategories = async () => {
    try {
      const data = await getCategories();
      if (data) {
        setCategories(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetCategories();
    };
  }, []);

  return (
    <main className="flex flex-col justify-center sm:justify-start gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white mt-150 min-h-screen mb-28">
      <h2 className="text-[32px] font-semibold">Categories</h2>
      <div className="grid grid-cols-10 gap-x-4 gap-y-4">
        {categories.map((category) => (
          <CategoryCard
            category={category}
            key={category?._id}
            onClick={() =>
              router.push(`/products?category=${category?.name?.toLowerCase()}`)
            }
            className={"col-span-10 sm:col-span-5 md:col-span-2"}
          />
        ))}
      </div>
    </main>
  );
}
