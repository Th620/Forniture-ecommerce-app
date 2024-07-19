import React from "react";
import CategoryCard from "./CategoryCard";

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

  return (
    <section className="flex flex-col justify-center gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white py-14">
      <h2 className="max-md:text-center text-[32px] font-semibold">
        Categories
      </h2>
      <button
        type="button"
        className="self-end capitalize hidden md:block text-[12px] text-gray underline"
      >
        show all
      </button>
      <div className="grid grid-cols-12 gap-x-4 gap-y-4 py-1">
        {categories.slice(0, 4).map((category) => (
          <CategoryCard
            category={category}
            key={category.id}
            className={"col-span-12 sm:col-span-6 md:col-span-3 "}
          />
        ))}
      </div>
      <button
        type="button"
        className="capitalize md:hidden block text-gray font-semibold border border-gray w-fit self-center px-8 rounded-sm py-2"
      >
        show all
      </button>
    </section>
  );
};

export default CategoriesSection;
