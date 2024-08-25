"use client";

import SizeButton from "@/components/SizeButton";
import { BASE_URL } from "@/constants";
import { deleteProduct, getProduct } from "@/services/products";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Product() {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

  const { slug } = useParams();

  const router = useRouter();

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

  const handelDeleteProduct = async (id) => {
    try {
      if (confirm("Are you sure you want to delete this product")) {
        setIsLoading(true);
        await deleteProduct({ id });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error.message);

      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // handelGetProduct(slug);
  console.log(product?.images);
  console.log(images);

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
    <>
      {isLoading ? (
        <div className="min-h-screen flex justify-center w-full bg-white dark:bg-black text-black dark:text-white items-center pt-[60px] md:pl-[20%]">
          {"Loading..."}
        </div>
      ) : (
        <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] text-black dark:text-white">
          <div className="flex flex-col md:grid md:grid-cols-18 gap-4 grid-flow-col-dense p-5">
            <h3 className="font-semibold text-xl sm:text-3xl capitalize md:hidden">
              {product?.title}
            </h3>
            <div className="md:col-span-8 md:col-start-1 w-full flex flex-col gap-y-4 md:order-first">
              <div className="relative w-full aspect-square bg-white dark:bg-black">
                <Image
                  src={BASE_URL + selectedImg}
                  layout="fill"
                  objectFit="cover"
                  alt={product?.title}
                />
              </div>
              <div className="w-full grid grid-cols-4 gap-x-4">
                {images.map((image) => (
                  <div
                    key={image}
                    onClick={() => setSelectedImg(image)}
                    className={`relative col-span-1 w-full aspect-square bg-white dark:bg-black ${
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
                <h6 className="max-md:text-sm font-semibold mb-3 capitalize">
                  product Colors
                </h6>
                <div className="flex gap-2 flex-wrap">
                  {product?.colors &&
                    product?.colors.map((color) => (
                      <div
                        className={`border-[1.5px] py-2 px-6 border-yellow text-white bg-yellow text-sm capitalize rounded-sm`}
                      >
                        {color}
                      </div>
                    ))}
                </div>
              </div>
              <div className="w-full">
                <h6 className="max-md:text-sm font-semibold mb-3">
                  product Sizes
                </h6>
                <div className="flex gap-2 text-navy flex-wrap w-full">
                  {product?.sizes &&
                    product?.sizes.map((size) => (
                      <div
                        className={`border-[1.5px] py-2 px-6 border-yellow text-white bg-yellow text-sm capitalize rounded-sm`}
                      >
                        {size}
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h6 className="max-md:text-sm font-semibold mb-3">Stock</h6>
                <div className="h-8 bg-gray flex justify-center items-center w-fit px-4 text-white">
                  {product?.stock}
                </div>
              </div>

              <div className="flex flex-col justify-start">
                <div className="flex gap-x-4 mb-4">
                  <button type="button" className="font-semibold md:text-lg">
                    Product Info
                  </button>
                  <button
                    type="button"
                    className="font-semibold opacity-25 md:text-lg"
                  >
                    Reviews
                  </button>
                </div>
                <p className="text-sm text-justify mb-2">
                  {product?.productInfo?.desc}
                  {product?.productInfo?.desc &&
                    product?.productInfo?.desc[
                      product?.productInfo?.desc.length - 1
                    ] !== "." &&
                    "."}
                </p>
                <p className="text-sm text-justify">Product details:</p>
                <ol className="text-sm list-disc">
                  {product?.productInfo?.features.map((feature) => (
                    <li key={feature} className="ml-6">
                      {feature}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/dashboard/products/edit/${product?.slug}`)
                  }
                  className="capitalize rounded-full px-10 py-2 text-white bg-navy hover:bg-navyHover w-fit my-14 font-medium"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handelDeleteProduct(product?._id);
                    router.back();
                  }}
                  className="capitalize rounded-full px-10 py-2 text-white bg-gray  hover:bg-grayHover w-fit my-14 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
