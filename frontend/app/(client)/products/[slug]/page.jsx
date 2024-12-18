"use client";

import SizeButton from "@/components/SizeButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { addReview, getProduct, getSuggestions } from "@/services/products";
import { BASE_URL } from "@/constants";
import Link from "next/link";
import { addItem } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useStateContext } from "@/context/StateContext";
import { MdDelete, MdOutlineErrorOutline } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
import { deleteReview } from "@/services/review";
import MobileCart from "@/components/MobileCart";
import ProductCard from "@/components/ProductCard";

const unavailableSize = (variations = [], color, size) => {
  return variations.every((variation) => {
    return (
      color &&
      size &&
      (variation.color !== color ||
        variation.size !== size ||
        variation.stock <= 0)
    );
  });
};

const unavailableColor = (variations = [], color) => {
  return variations.every((variation) => {
    return (
      color &&
      (variation.color !== color ||
        (variation.color === color && variation.stock <= 0))
    );
  });
};

export default function Product() {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImg, setSelectedImg] = useState("");
  const [qt, setQt] = useState(1);
  const [variations, setVariations] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewForm, setReviewForm] = useState(false);
  const [review, setReview] = useState("");
  const [done, setDone] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState(
    searchParams.get("color") || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    searchParams.get("size") || ""
  );

  const [openCart, setOpenMobileCart] = useState(false);

  const { user } = useAuth();

  const { slug } = useParams();

  const cart = useSelector((state) => state.cart);

  const handleGetProduct = async (slug) => {
    try {
      const product = await getProduct({ slug });
      if (product) {
        setProduct(product);
        setImages(product?.images);
        setSelectedImg(product?.images[0]);

        if (!searchParams.get("color")) {
          let result = product?.colors?.find((color) => {
            return !unavailableColor(product?.variations, color);
          });
          if (result) {
            setSelectedColor(result);
          }
        }
        if (product?.variations) {
          setVariations(product.variations);
        }
        if (product?.stock === 0) {
          setError({ addToCart: true, Error: "Out of Stock" });
        }
      }
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handelYouMayAlsoLike = async () => {
    try {
      const data = await getSuggestions({ slug });
      if (data) {
        setSuggestions(data);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await addReview({ slug, content: review });
      setReviewForm(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
      }, 5000);
      setReview("");
    } catch (error) {
      setError({ Error: error.message });
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await deleteReview({ id });
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    return async () => {
      try {
        await handleGetProduct(slug);
        await handelYouMayAlsoLike();
        setIsLoading(false);
      } catch (error) {}
    };
  }, []);

  const { setOpenCart } = useStateContext();

  return (
    <main className="relative flex flex-col gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white mt-[100px] md:mt-150 min-h-screen mb-28">
      {error ? (
        <div className="w-full h-screen text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
          <MdOutlineErrorOutline className="md:text-lg text-3xl" />
          {error}
        </div>
      ) : (
        <>
          <div className="flex flex-col md:grid md:grid-cols-18 gap-4 grid-flow-col-dense">
            <h3 className="font-semibold text-xl sm:text-3xl capitalize md:hidden">
              {product?.title}
            </h3>
            <div className="md:col-span-8 md:col-start-1 w-full flex flex-col gap-y-4 md:order-first">
              <div className="relative w-full aspect-square bg-bg">
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
                    className={`relative col-span-1 w-full aspect-square cursor-pointer dark:bg-black bg-bg ${
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
                className=""
                href={`${
                  product?.category
                    ? `/products?category=${product.category.name}`
                    : ""
                }`}
              >
                <p className="text-xs text-blue-800 ml-[2px] capitalize">
                  {product?.category
                    ? product.category?.name
                    : "not categorized"}
                </p>
              </Link>
              <p className="font-semibold text-sm text-[#787676] mt-3">
                {product?.onSale ? (
                  <>
                    {product?.salePrice} DZD{" "}
                    <span className="text-gray line-through ml-2">
                      {product?.price} DZD
                    </span>
                  </>
                ) : (
                  <>{product?.price} DZD</>
                )}
              </p>
              <div className="mt-4">
                <h6 className="max-md:text-sm font-semibold mb-3">
                  Choose a Color
                </h6>
                <div className="flex gap-2 flex-wrap">
                  {product?.colors &&
                    product?.colors.map((color) => (
                      <>
                        <SizeButton
                          key={color}
                          label={color}
                          unavailable={
                            unavailableColor(variations, color) ||
                            product?.stock === 0 ||
                            product?.variations?.every(
                              (variation) => variation.stock === 0
                            )
                          }
                          selected={selectedColor === color}
                          onclick={() => {
                            router.replace(
                              `/products/${slug}?color=${color}${
                                !unavailableSize(
                                  variations,
                                  color,
                                  selectedSize
                                ) && selectedSize
                                  ? `&size=${selectedSize}`
                                  : ""
                              }`,
                              { scroll: true }
                            );
                            if (
                              unavailableSize(variations, color, selectedSize)
                            ) {
                              setSelectedSize("");
                            }
                            setSelectedColor(color);
                          }}
                        />
                      </>
                    ))}
                </div>
              </div>
              <div className="w-full mt-4">
                <h6 className="max-md:text-sm font-semibold mb-3">
                  Choose a Size
                </h6>
                <div className="flex gap-2 text-navy flex-wrap w-full">
                  {product?.sizes &&
                    product?.sizes.map((size) => (
                      <SizeButton
                        key={size}
                        label={size}
                        unavailable={
                          unavailableSize(variations, selectedColor, size) ||
                          product?.stock === 0 ||
                          product?.variations?.every(
                            (variation) => variation.stock === 0
                          )
                        }
                        selected={selectedSize === size}
                        onclick={() => {
                          router.replace(
                            `/products/${slug}?color=${selectedColor}&size=${size}`,
                            { scroll: true }
                          );
                          setSelectedSize(size);
                        }}
                      />
                    ))}
                </div>
              </div>
              <div className="mt-4">
                <h6 className="max-md:text-sm font-semibold mb-3">
                  Choose a Quantity
                </h6>
                <div className="flex justify-center items-center w-fit sm:h-8 h-6 mb-4 gap-2">
                  <div className="h-full bg-gray flex justify-center items-center w-fit text-white">
                    <button
                      type="button"
                      disabled={qt === 1}
                      onClick={() => {
                        if (qt > 1) {
                          setQt(qt - 1);
                        }
                      }}
                      className="h-full aspect-square flex justify-center items-center font-semibold hover:bg-grayHover disabled:hover:bg-gray transition-colors duration-100"
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
                      value={qt}
                      readOnly
                      className="h-full text-center w-10 bg-gray"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setQt(qt + 1);
                      }}
                      className="h-full aspect-square flex justify-center items-center font-semibold hover:bg-grayHover transition-colors duration-100"
                    >
                      +
                    </button>
                  </div>
                  {product?.stock > 0 && product?.stock <= 10 && (
                    <p className="text-[#353535] font-medium text-[10px]">
                      Only{" "}
                      <span className="text-yellow font-semibold ">
                        {`${product?.stock} item${
                          product?.stock === 1 ? "" : "s"
                        }`}{" "}
                        left!
                      </span>
                      <br />
                      Don't miss it
                    </p>
                  )}
                </div>
              </div>
              {error?.addToCart && (
                <p className="text-xs text-red-400">{error.Error}</p>
              )}
              <button
                type="button"
                disabled={
                  product?.stock === 0 ||
                  product?.variations?.every(
                    (variation) => variation.stock === 0
                  )
                }
                onClick={() => {
                  const cartItem = cart?.items.find(
                    (item) =>
                      item?._id === product?._id &&
                      item?.color?.toLowerCase() ===
                        selectedColor?.toLowerCase() &&
                      item?.size?.toLowerCase() === selectedSize?.toLowerCase()
                  );
                  if (!selectedColor || !selectedSize) {
                    setError({
                      addToCart: true,
                      Error: "Please select a size to proceed.",
                    });
                    setTimeout(() => {
                      setError(null);
                    }, 3000);
                    return;
                  }
                  if (qt + cartItem?.quantity > product?.stock) {
                    setError({
                      addToCart: true,
                      Error:
                        "The requested quantity exceeds our current stock. Please adjust your order.",
                    });
                    setTimeout(() => {
                      setError(null);
                    }, 5000);
                    return;
                  }
                  const variation = product?.variations.find((e) => {
                    return (
                      e.color === selectedColor.toLowerCase() &&
                      e.size === selectedSize.toLowerCase()
                    );
                  });
                  if (qt + cartItem?.quantity > variation?.stock) {
                    setError({
                      addToCart: true,
                      Error:
                        "The requested quantity exceeds our current stock. Please adjust your order.",
                    });
                    setTimeout(() => {
                      setError(null);
                    }, 5000);
                    return;
                  }
                  if (
                    unavailableSize(variations, selectedColor, selectedSize)
                  ) {
                    setError({
                      addToCart: true,
                      Error: "Unavailable color and size combination",
                    });
                    setTimeout(() => {
                      setError(null);
                    }, 5000);
                    return;
                  }
                  if (unavailableColor(variations, selectedColor)) {
                    setError({
                      addToCart: true,
                      Error: "Unavailable color and size combination",
                    });
                    setTimeout(() => {
                      setError(null);
                    }, 5000);
                    return;
                  }
                  dispatch(
                    addItem({
                      _id: product?._id,
                      title: product?.title,
                      slug: product?.slug,
                      price: product?.price,
                      color: selectedColor,
                      size: selectedSize,
                      quantity: qt,
                      image: product?.images[0],
                    })
                  );
                  setOpenCart(true);
                  setTimeout(() => {
                    setOpenCart(false);
                  }, 3000);
                  setOpenMobileCart(true);
                  setTimeout(() => {
                    setOpenMobileCart(false);
                  }, 3000);
                  setQt(1);
                }}
                className="capitalize disabled:opacity-70 rounded-full px-10 py-2 text-white bg-yellow bg-opacity-95 hover:bg-opacity-100 w-fit mt-4 mb-8 font-medium"
              >
                Add to card
              </button>
              <div className="flex w-full flex-col justify-start">
                <div className="flex gap-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setShowReviews(false)}
                    className={`font-semibold md:text-lg transition-colors duration-150 ${
                      !showReviews ? "text-black" : "text-[#D0CECE]"
                    }`}
                  >
                    Product Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviews(true)}
                    className={`font-semibold md:text-lg  transition-colors duration-150 ${
                      showReviews ? "text-black" : "text-[#D0CECE]"
                    }`}
                  >
                    Reviews
                  </button>
                  {showReviews && (
                    <button
                      type="button"
                      onClick={() => setReviewForm(true)}
                      className="ml-auto text-sm px-3 py-1 bg-navy hover:bg-navyHover transition-all duration-200 rounded-full text-white"
                    >
                      Add Review
                    </button>
                  )}
                </div>
                {showReviews ? (
                  <div
                    className={`w-full relative bg-white z-10 overflow-hidden ${
                      product?.reviews?.length > 2 ? "h-56" : "h-[100px]"
                    }`}
                  >
                    <div
                      className={`${
                        product?.reviews?.length === 0 ? "noReviews" : "reviews"
                      } absolute top-0 left-0 overflow-y-scroll overflow-x-hidden z-0 flex flex-col items-center gap-y-1 bg-bg px-2 py-2 border-b border-gray ${
                        product?.reviews?.length === 0
                          ? "border-opacity-0"
                          : " border-opacity-30"
                      }  ${product?.reviews?.length > 2 ? "h-56" : "h-fit"}`}
                    >
                      {done && !reviewForm && (
                        <p className="text-sm text-justify px-3 py-2">
                          Your review will be visible after it has been chacked
                          and approved by our admin team.
                        </p>
                      )}
                      {reviewForm && (
                        <form
                          onSubmit={handleAddReview}
                          className="flex flex-col w-full h-fit gap-y-2"
                        >
                          <textarea
                            name="review"
                            rows={2}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Your review..."
                            className="w-full resize-none outline-none py-1 px-2 text-sm rounded-sm bg-white"
                          ></textarea>
                          <div className="flex self-end gap-x-2 text-sm text-white">
                            <button
                              type="submit"
                              className="px-3 py-1 bg-yellow rounded-full"
                            >
                              Add review
                            </button>
                            <button
                              type="button"
                              onClick={() => setReviewForm(false)}
                              className="px-3 py-1 bg-gray rounded-full"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                      {(!product?.reviews || product?.reviews?.length === 0) &&
                        !reviewForm &&
                        !done && <p className="text-gray py-2">No Reviews</p>}
                      {product?.reviews &&
                        !reviewForm &&
                        !done &&
                        product?.reviews.map((review) => (
                          <div
                            key={review._id}
                            className="w-full border border-gray py-2 px-2 border-opacity-50 rounded-md bg-white flex justify-between items-center"
                          >
                            <div>
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
                              <div className="py-2 text-sm">
                                {review.content}
                              </div>
                            </div>
                            {user?._id == review?.user?._id && (
                              <button
                                type="button"
                                onClick={async () => {
                                  await handleDeleteReview(review?._id);
                                  await handleGetProduct(slug);
                                }}
                              >
                                <MdDelete className="text-gray text-lg" />
                              </button>
                            )}
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
                          <li key={feature} className="ml-6">
                            {feature}
                            {feature[feature.length - 1] !== "." && "."}
                          </li>
                        ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="md:mt-14 md:mb-14">
            <h3 className="font-semibold pb-2 text-lg">You may also like</h3>
            <div className="grid grid-cols-10 gap-x-4 gap-y-4 py-3">
              {suggestions.length > 0 &&
                suggestions?.map((product) => (
                  <ProductCard
                    product={product}
                    key={product._id}
                    className={"col-span-10 md:col-span-2"}
                  />
                ))}
            </div>
          </div>
          {openCart && (
            <MobileCart setOpenCart={setOpenMobileCart} openCart={openCart} />
          )}
        </>
      )}
    </main>
  );
}
