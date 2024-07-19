import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoryCard = ({ className, category }) => {
  return (
    <div className={`${className} relative font-montserrat`}>
      <Link href={"/"} className="flex flex-col">
        <div className="relative overflow-hidden w-full aspect-[1/1.4] bg-bg flex justify-center items-center">
          <Image src={"/chair.png"} objectFit="cover" fill alt={category.title} />
        </div>
        <h6 className="capitalize text-sm">{category.title}</h6>
      </Link>
    </div>
  );
};

export default CategoryCard;
