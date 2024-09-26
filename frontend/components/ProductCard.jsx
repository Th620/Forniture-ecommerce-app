import { BASE_URL } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({
  className,
  product,
  soldOut = false,
  onSale = false,
}) => {
  return (
    <div className={`${className} relative font-montserrat`}>
      {soldOut && (
        <div className="capitalize absolute top-10 left-0 w-full py-3 bg-white bg-opacity-90 text-black text-opacity-90 z-10 text-sm text-center">
          Sold out
        </div>
      )}
      {onSale && (
        <div className="capitalize absolute top-2 left-1.5 rounded-full py-1 px-3 bg-[#4D5956] text-white z-20 text-xs text-center">
          on sale
        </div>
      )}
      <Link href={`/products/${product?.slug}`} className="flex flex-col">
        <div className="relative overflow-hidden w-full aspect-[1/1.4] bg-bg flex justify-center items-center">
          <Image
            src={product?.images ? BASE_URL + product?.images[0] : "/not-found.png"}
            objectFit="cover"
            layout="fill"
            alt={product?.title}
          />{" "}
          {soldOut && (
            <div className="w-full h-full bg-black bg-opacity-10 absolute top-0 left-0"></div>
          )}
        </div>
        <h6 className="capitalize text-xs font-semibold mt-1">
          {product?.title}
        </h6>
        <p className="text-[10px] text-[#787676] font-medium leading-none">
          {product?.onSale ? product?.salePrice : product?.price} DZD
        </p>
      </Link>
    </div>
  );
};

export default ProductCard;
