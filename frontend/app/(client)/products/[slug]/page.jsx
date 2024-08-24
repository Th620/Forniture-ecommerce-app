"use client";

import ColorCircle from "@/components/ColorCircle";
import SizeButton from "@/components/SizeButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { getProduct } from "@/services/products";
import { BASE_URL, products } from "@/constants";

export default function Product() {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState("");

  const { slug } = useParams();

  const handelGetProduct = async (slug) => {
    try {
      setIsLoading(true);
      const product = await getProduct({ slug });
      if (product) {
        console.log(product);
        setProduct(product);
        setImages(product?.images);
        setSelectedImg(product?.images[0]);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 3000);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return async () => {
      try {
        console.log(slug);
        await handelGetProduct(slug);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };
  }, []);

  return (
    <main className="relative flex flex-col gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white mt-150 min-h-screen mb-28">
      <div className="flex flex-col md:grid md:grid-cols-18 gap-4 grid-flow-col-dense">
        <h3 className="font-semibold text-xl sm:text-3xl capitalize md:hidden">
          {product?.title}
        </h3>
        <div className="md:col-span-8 md:col-start-1 w-full flex flex-col gap-y-4 md:order-first">
          <div className="relative w-full aspect-square">
            <Image
              src={BASE_URL + selectedImg}
              layout="fill"
              objectFit="cover"
              alt="img"
            />
          </div>
          <div className="w-full grid grid-cols-4 gap-x-4">
            {images.map((image) => (
              <div
                key={image}
                onClick={() => setSelectedImg(image)}
                className={`relative col-span-1 w-full aspect-square bg-white cursor-pointer dark:bg-black ${
                  selectedImg === image ? "opacity-50" : "opacity-100"
                }`}
              >
                <Image
                  src={BASE_URL + image}
                  layout="fill"
                  objectFit="cover"
                  alt={product?.title}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-start-10 md:col-span-9 flex flex-col gap-5">
          <h3 className="hidden md:block font-semibold text-xl sm:text-3xl capitalize">
            {product?.title}
          </h3>
          <p className="font-semibold text-sm text-[#787676]">
            {product?.price}DZD
          </p>
          <div>
            <h6 className="max-md:text-sm font-semibold mb-3">
              Choose a Color
            </h6>
            <div className="flex gap-2 flex-wrap">
              {product?.colors &&
                product?.colors.map((color) => (
                  <SizeButton
                    label={color}
                    unavailable={true}
                    selected={false}
                  />
                ))}
            </div>
          </div>
          <div className="w-full">
            <h6 className="max-md:text-sm font-semibold mb-3">Choose a Size</h6>
            <div className="flex gap-2 text-navy flex-wrap w-full">
              {product?.sizes &&
                product?.sizes.map((size) => (
                  <SizeButton
                    label={size}
                    unavailable={false}
                    selected={false}
                  />
                ))}
            </div>
          </div>
          <div>
            <h6 className="max-md:text-sm font-semibold mb-3">
              Choose a Quantity
            </h6>
            <div className="sm:h-8 h-6 bg-gray flex justify-center items-center w-fit text-white">
              <button
                type="button"
                className="h-full aspect-square flex justify-center items-center font-semibold hover:bg-grayHover transition-colors duration-100"
              >
                -
              </button>
              <label htmlFor="Qt" className="sr-only">
                Quantity
              </label>
              <input
                type="number"
                id="Qt"
                min={1}
                inputMode="numeric"
                size={2}
                value={1}
                readOnly
                className="h-full text-center bg-gray"
              />
              <button
                type="button"
                className="h-full aspect-square flex justify-center items-center font-semibold hover:bg-grayHover transition-colors duration-100"
              >
                +
              </button>
            </div>
          </div>
          <button
            type="button"
            className="capitalize rounded-full px-10 py-3 text-white bg-navy hover:bg-navyHover w-fit my-8 font-medium"
          >
            Add to card
          </button>
          <div>
            <div className="flex flex-col justify-start">
              <div className="flex gap-x-4 mb-4">
                <button type="button" className="font-semibold md:text-lg">
                  Product Info
                </button>
                <button
                  type="button"
                  className="font-semibold text-[#D0CECE] md:text-lg"
                >
                  Reviews
                </button>
              </div>
              <div>
                <p className="text-sm text-justify text-gray">
                  {!product?.productInfo?.desc &&
                    ((product?.productInfo?.features &&
                      product?.productInfo?.features.length === 0) ||
                      !product?.productInfo?.features) &&
                    "No description"}
                </p>
                <p className="text-sm text-justify mb-2">
                  {product?.productInfo?.desc}
                  {product?.productInfo?.desc &&
                    product?.productInfo?.desc[
                      product?.productInfo?.desc.length - 1
                    ] !== "." &&
                    "."}
                </p>
                <p className="text-sm text-justify mb-1">
                  {product?.productInfo?.features &&
                    product?.productInfo?.features.length !== 0 &&
                    "Product details:"}
                </p>
                <ol className="text-sm list-disc">
                  {product?.productInfo?.features &&
                    product?.productInfo?.features.map((feature) => (
                      <li className="ml-6">
                        {feature}
                        {feature[feature.length - 1] !== "." && "."}
                      </li>
                    ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:mt-28 md:mb-14">
        <h3 className="font-semibold pb-2 text-lg">You may also like</h3>
        <div className="grid grid-cols-12 gap-x-4 gap-y-4 py-3">
          {/* {products.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              className={"col-span-12 sm:col-span-6 md:col-span-3"}
            />
          ))} */}
        </div>
      </div>
    </main>
  );
}
