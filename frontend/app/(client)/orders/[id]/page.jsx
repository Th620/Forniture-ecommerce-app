"use client";

import { BASE_URL } from "@/constants";
import { cancelOrder, getOrder } from "@/services/order";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Order() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [canceled, setCanceled] = useState(false);

  const dispatch = useDispatch();

  const handleGetOrder = async () => {
    try {
      const data = await getOrder({ id });
      if (data) {
        setOrder(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setIsLoading(true);
      await cancelOrder({ id });
      setCanceled(true);
      setTimeout(() => {
        setCanceled(false);
      }, 3000);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetOrder();
    };
  }, [canceled]);

  return (
    <main className="flex flex-col justify-start items-center gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14 mt-150 min-h-screen mb-14 relative">
      {!order && !isLoading && (
        <div className="w-full h-screen fixed top-0 left-0 flex justify-center items-center">
          {error ? error.message : "An error occured. Please try again"}
        </div>
      )}
      {isLoading && (
        <div className="w-full h-screen fixed top-0 left-0 flex justify-center items-center">
          {"Loading..."}
        </div>
      )}
      {order && !isLoading && (
        <>
          <h2 className="md:text-[32px] text-[24px] font-semibold capitalize self-start">
            Order <span className="pl-1 text-sm md:text-lg">#{id}</span>
          </h2>
          <div className="w-full p-5 pl-0 flex flex-col gap-2">
            <p>
              ID:{" "}
              <span className="pl-1 text-[black] text-opacity-45">
                {order?._id}
              </span>
            </p>
            <p>
              Client:{" "}
              <span className="pl-1 text-[black] text-opacity-45 capitalize">
                {order?.client?.firstName} {order?.client?.lastName}
              </span>
            </p>
            <p>
              Email:{" "}
              <span className="pl-1 text-[black] text-opacity-45">
                {order?.client?.email}
              </span>
            </p>
            <p>
              Phone:{" "}
              <span className="pl-1 text-[black] text-opacity-45">
                {order?.client?.phone}
              </span>
            </p>
            <p>
              TotalCost:{" "}
              <span className="pl-1 text-[black] text-opacity-45">
                {order?.totalCost} DZD
              </span>
            </p>
            <p>
              Date:{" "}
              <span className="pl-1 text-[black] text-opacity-45">
                {new Date(order?.createdAt).toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </p>
            <p>
              Shipping date:{" "}
              <span className="pl-1 text-[black] text-opacity-45">
                {order?.shippingDate
                  ? new Date(order.shippingDate).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Shipping date not yet available"}
              </span>
            </p>
            <p>
              Shipping fees:{" "}
              <span className="pl-1 text-[black] text-opacity-45">
                {order?.shippingFees} DZD
              </span>
            </p>{" "}
            <p>
              Status:{" "}
              <span
                className={`text-[black] text-opacity-45 py-1.5 px-4 rounded-full text-xs ml-2 capitalize ${
                  order?.status === "canceled" &&
                  " bg-red-200 dark:bg-opacity-90 text-red-500 "
                } ${
                  order?.status === "dilevered" &&
                  " bg-blue-200 dark:bg-opacity-90 text-blue-600 "
                }${
                  order?.status === "pending" &&
                  " bg-orange-200 dark:bg-opacity-85 text-orange-600 "
                }${
                  order?.status === "confirmed" &&
                  " bg-green-200 dark:bg-opacity-90 text-green-600"
                }`}
              >
                {order?.status}
              </span>
            </p>
            <div className="w-full grid grid-cols-2 gap-8 mt-8">
              <div className="md:col-span-1 col-span-2">
                <h4 className="py-3 border-b-[1.5px] border-gray border-opacity-20 font-semibold text-lg">
                  Products:
                </h4>
                <div className="md:w-1/2 ml-4 mt-2">
                  {order?.products?.map((product) => (
                    <div className="flex items-stretch py-2">
                      <Link href={`/products/${product?.product?.slug}`}>
                        <div className="relative aspect-[1/1.2] w-[52px] bg-bg mr-2">
                          <Image
                            src={
                              product?.product?.images
                                ? BASE_URL + product.product.images[0]
                                : "/lamp.png"
                            }
                            layout="fill"
                            objectFit="cover"
                            alt={product?.product?.title}
                          />
                        </div>
                      </Link>
                      <div className="h-full">
                        <Link href={`/products/${product?.product?.slug}`}>
                          <h3 className="text-wrap text-sm text-opacity-50 hover:text-opacity-100">
                            <span className="capitalize">{`${product?.product?.title}`}</span>
                            {` - ${product?.color}, ${product?.size}`}
                          </h3>
                        </Link>
                        <p className="text-xs text-[#8C8C8C]">
                          {product?.quantity}{" "}
                          <span>× {product?.product?.price} DZD</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-1 col-span-2 capitalize">
                <h4 className="py-3 border-b-[1.5px] border-gray border-opacity-20 font-semibold text-lg">
                  Shipping Address:
                </h4>
                <div className="w-full ml-4 mt-2 flex flex-col gap-2 text-sm">
                  {" "}
                  <p>
                    Country:{" "}
                    <span className="pl-1 text-[black] text-opacity-45">
                      {order?.shipping?.country}
                    </span>
                  </p>
                  <p>
                    State:{" "}
                    <span className="pl-1 text-[black] text-opacity-45">
                      {order?.shipping?.state}
                    </span>
                  </p>
                  <p>
                    City:{" "}
                    <span className="pl-1 text-[black] text-opacity-45">
                      {order?.shipping?.city}
                    </span>
                  </p>
                  <p>
                    Address:{" "}
                    <span className="pl-1 text-[black] text-opacity-45">
                      {order?.shipping?.address}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {order?.status === "pending" && (
              <div className="mt-14">
                <button
                  type={"button"}
                  onClick={async () => {
                    await handleCancelOrder();
                  }}
                  className="capitalize pt-2 pb-[11px] bg-red-200 text-red-400 px-10 font-semibold transition-colors duration-75 mt-4 self-center"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
