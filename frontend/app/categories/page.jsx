import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/constants";

export default function Categories() {
  return (
    <main className="flex flex-col justify-center sm:justify-start gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white py-14 pt-150 min-h-screen">
      <h2 className="text-[32px] font-semibold">Categories</h2>
      <div className="grid grid-cols-12 gap-x-4 gap-y-4">
        {categories.map((category) => (
          <CategoryCard
            category={category}
            key={category.id}
            className={"col-span-12 sm:col-span-6 md:col-span-3"}
          />
        ))}
      </div>
    </main>
  );
}
