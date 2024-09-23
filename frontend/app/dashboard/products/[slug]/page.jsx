"use client";

import Loading from "@/app/loading";
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
  const [showReviews, setShowReviews] = useState(false);

  const { slug } = useParams();

  const router = useRouter();

  const handleGetProduct = async (slug) => {
    try {
      setIsLoading(true);
      const product = await getProduct({ slug });
      if (product) {
        setProduct(product);
        setImages(product?.images);
        setSelectedImg(product?.images[0]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteProduct = async (id) => {
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

  // handleGetProduct(slug);
  console.log(product);

  useEffect(() => {
    return async () => {
      try {
        console.log(slug);
        await handleGetProduct(slug);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading className={"dash-load max-md:p-0"} />
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
            <div className="md:col-start-10 md:col-span-9 flex flex-col">
              <h3 className="hidden md:block font-semibold text-xl sm:text-3xl capitalize">
                {product?.title}
              </h3>
              <Link
                className="mb-2 mt-1"
                href={`${
                  product?.category
                    ? `/dashboard/products?category=${product.category.name}`
                    : ""
                }`}
              >
                <p className="text-xs text-blue-800 ml-[2px] capitalize">
                  {product?.category
                    ? product.category?.name
                    : "not categorized"}
                </p>
              </Link>
              <p className="font-semibold text-sm text-[#787676]">
                {product?.price}DZD
              </p>
              <div className="mt-5">
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
              <div className="w-full mt-5">
                <h6 className="max-md:text-sm font-semibold mb-3 capitalize">
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
              <div className="mt-5">
                <h6 className="max-md:text-sm font-semibold mb-3">Stock</h6>
                <div className="h-8 bg-gray flex justify-center items-center w-fit px-4 text-white">
                  {product?.stock}
                </div>
              </div>
              <div className="w-full mt-5">
                <h6 className="max-md:text-sm font-semibold capitalize mb-3">
                  product variations
                </h6>
                <div className="flex gap-2 flex-wrap w-full">
                  <ul
                    className={`text-sm font-medium px-6 pt-2 list-disc capitalize`}
                  >
                    {product?.variations?.map((variation) => (
                      <li className="">
                        {variation.size} - {variation.color} × {variation.stock}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex w-full flex-col justify-start text-black dark:text-white mt-5">
                <div className="flex gap-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setShowReviews(false)}
                    className={`font-semibold md:text-lg transition-colors duration-150 ${
                      !showReviews
                        ? "text-black dark:text-white"
                        : "text-[#D0CECE] text-opacity-50"
                    }`}
                  >
                    Product Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviews(true)}
                    className={`font-semibold md:text-lg  transition-colors duration-150 ${
                      showReviews
                        ? "text-black dark:text-white"
                        : "text-[#D0CECE] text-opacity-50"
                    }`}
                  >
                    Reviews
                  </button>
                </div>
                {showReviews ? (
                  <div
                    className={`w-full relative bg-bg dark:bg-darkBody z-10 overflow-hidden ${
                      product?.reviews?.length > 2 ? "h-56" : "h-[100px]"
                    } 
                    `}
                  >
                    <div
                      className={`${
                        product?.reviews?.length === 0 ? "noReviews" : "reviews"
                      } absolute top-0 left-0 overflow-y-scroll overflow-x-hidden z-0 flex flex-col items-center gap-y-1 bg-bg dark:bg-darkBody px-2 py-2 ${
                        product?.reviews?.length === 0
                          ? "border-opacity-0"
                          : "border-opacity-30"
                      }  ${product?.reviews?.length > 2 ? "h-56" : "h-fit"}`}
                    >
                      {!product?.reviews ||
                        (product?.reviews?.length === 0 && (
                          <p className="text-gray">No Reviews</p>
                        ))}
                      {product?.reviews &&
                        product?.reviews.map((review) => (
                          <div
                            key={review._id}
                            className="w-full border border-gray py-2 px-2 border-opacity-50 rounded-md bg-white dark:bg-darkBg"
                          >
                            <div className="flex justify-center items-center w-fit gap-2">
                              <div className="w-5 h-5 bg-gray rounded-full flex justify-center items-center text-xs capitalize">
                                {review.user.firstName[0]}
                              </div>
                              <div className="flex flex-col justify-center text-[10px] leading-tight capitalize">
                                <p>
                                  {review.user.lastName[0]}.{" "}
                                  {review.user.firstName}
                                </p>
                                <p>
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="py-2 text-sm">{review.content}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-fit">
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
                )}
              </div>
              <div className="flex gap-4 mt-5">
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
                  onClick={() =>
                    router.push(`/dashboard/products/${slug}/reviews`)
                  }
                  className="capitalize rounded-full px-10 py-2 text-white bg-navy hover:bg-navyHover w-fit my-14 font-medium"
                >
                  manage reviews
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleDeleteProduct(product?._id);
                    router.push("/dashboard/products");
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
