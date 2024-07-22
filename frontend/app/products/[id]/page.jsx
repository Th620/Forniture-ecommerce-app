import ColorCircle from "@/components/ColorCircle";
import SizeButton from "@/components/SizeButton";
import Image from "next/image";
import React from "react";
import ProductCard from "@/components/ProductCard";

const img = [1, 2, 3];
const colors = [
  { color: "green", available: true },
  { color: "red", available: false },
  { color: "blue", available: true },
];
const btns = ["large", "meduim", "small"];
const products = [
  {
    id: 1,
    title: "chair",
    price: 45.5,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
  {
    id: 2,
    title: "chair",
    price: 45.99,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
  {
    id: 3,
    title: "chair",
    price: 45.0,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
  {
    id: 4,
    title: "chair",
    price: 45.0,
    keywords: [],
    productInfo: "",
    stock: 10,
    category: "",
    image: "",
  },
];

export default function Product() {
  return (
    <main className="relative flex flex-col gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white py-14 pt-150 min-h-screen mb-14">
      <div className="flex flex-col md:grid md:grid-cols-18 gap-4 grid-flow-col-dense">
        <h3 className="font-semibold text-xl sm:text-3xl capitalize md:hidden">
          Desk Lamp
        </h3>
        <div className="md:col-span-8 md:col-start-1 w-full flex flex-col gap-y-4 md:order-first">
          <div className="relative w-full aspect-square">
            <Image
              src={"/lamp.png"}
              layout="fill"
              objectFit="cover"
              alt="img"
            />
          </div>
          <div className="w-full grid grid-cols-4 gap-x-4">
            {img.map((img) => (
              <div
                key={img}
                className="relative col-span-1 w-full aspect-square bg-black"
              >
                <Image
                  src={"/lamp.png"}
                  layout="fill"
                  objectFit="cover"
                  alt="img"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-start-10 md:col-span-9 flex flex-col gap-5">
          <h3 className="hidden md:block font-semibold text-xl sm:text-3xl capitalize">
            Desk Lamp
          </h3>
          <p className="font-semibold text-sm text-[#787676]">$45.99</p>
          <div>
            <h6 className="max-md:text-sm font-semibold mb-3">
              Choose a Color
            </h6>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <ColorCircle
                  color={color.color}
                  available={color.available}
                  selected={true}
                />
              ))}
            </div>
          </div>
          <div className="w-full">
            <h6 className="max-md:text-sm font-semibold mb-3">Choose a Size</h6>
            <div className="flex gap-2 text-navy flex-wrap w-full">
              {btns.map((btn) => (
                <SizeButton label={btn} unavailable={false} selected={false} />
              ))}
            </div>
          </div>
          <div>
            <h6 className="max-md:text-sm font-semibold mb-3">
              Choose a Quantity
            </h6>
            <div className="h-8 bg-gray flex justify-center items-center w-fit text-white">
              <button
                type="button"
                className="h-full aspect-square flex justify-center items-center font-semibold hover:bg-grayHover transition-colors duration-100"
              >
                -
              </button>
              <div className="h-full px-4 min-h-8 flex justify-center items-center font-semibold">
                1
              </div>
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
            className="capitalize rounded-full px-10 py-3 text-white bg-navy hover:bg-navyHover w-fit my-14 font-medium"
          >
            Add to card
          </button>
          <div className="flex flex-col justify-start gap-4">
            <div className="flex gap-x-4">
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
            <p className="text-sm text-justify">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut sem
              nulla pharetra diam. Facilisi cras fermentum odio eu feugiat
              pretium nibh ipsum consequat. Magna fermentum iaculis eu non diam
              phasellus vestibulum lorem.
            </p>
            <p className="text-sm text-justify">Product details:</p>
            <ol className="text-sm list-disc">
              <li className="ml-6">Exclusively handmade.</li>
              <li className="ml-6">40cm hight.</li>
            </ol>
          </div>
        </div>
      </div>
      <div className="md:mt-28 md:mb-14">
        <h3 className="font-semibold pb-2 text-lg">You may also like</h3>
        <div className="grid grid-cols-12 gap-x-4 gap-y-4 py-3">
          {products.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              className={"col-span-12 sm:col-span-6 md:col-span-3"}
            />
          ))}
        </div>
      </div>
    </main>
  );
};
