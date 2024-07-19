import Image from "next/image";
import Link from "next/link";
import React from "react";

const productCard = ({ className, product }) => {
  return (
    <div className={`${className} relative font-montserrat`}>
      <Link href={"/"} className="flex flex-col">
        <div className="relative overflow-hidden w-full aspect-[1/1.4] bg-bg flex justify-center items-center">
          <Image src={"/lamp.png"} objectFit="cover" layout="fill" alt={product.title} />
        </div>
        <h6 className="capitalize text-sm">{product.title}</h6>
        <p className="text-[12px] text-gray leading-none">${product.price}</p>
      </Link>
    </div>
  );
};

export default productCard;
