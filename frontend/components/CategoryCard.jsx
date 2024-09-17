import { BASE_URL } from "@/constants";
import Image from "next/image";
import React from "react";

const CategoryCard = ({ className, category, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${className} relative font-montserrat cursor-pointer`}
    >
      <div className="relative overflow-hidden w-full aspect-[1/1.4] bg-bg flex justify-center items-center">
        <Image
          src={category?.image ? BASE_URL + category.image : "/lmap.png"}
          objectFit="cover"
          fill
          alt={category?.name}
        />
      </div>
      <h6 className="capitalize text-xs font-semibold">{category?.name}</h6>
    </div>
  );
};

export default CategoryCard;
