import { BASE_URL } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ className, product }) => {
  return (
    <div className={`${className} relative font-montserrat`}>
      <Link href={`/products/${product?.slug}`} className="flex flex-col">
        <div className="relative overflow-hidden w-full aspect-[1/1.4] bg-bg flex justify-center items-center">
          <Image
            src={product?.images ? BASE_URL + product?.images[0] : "/lamp.png"}
            objectFit="cover"
            layout="fill"
            alt={product?.title}
          />
        </div>
        <h6 className="capitalize text-xs font-semibold mt-1">
          {product?.title}
        </h6>
        <p className="text-[10px] text-[#787676] font-medium leading-none">
          ${product?.price}
        </p>
      </Link>
    </div>
  );
};

export default ProductCard;
