"use client";

import PricingBox from "@/components/PricingBox";
import { cancelOrder, confirmOrder, getOrder } from "@/services/order";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";

export default function Order() {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const { id } = useParams();

  const handelGetOrder = async (id) => {
    try {
      const data = await getOrder({ id });
      if (data) {
        setOrder(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handelConfirmOrder = async (id) => {
    try {
      setIsLoading(true);
      await confirmOrder({ id });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handelCancelOrder = async (id) => {
    try {
      setIsLoading(true);
      await cancelOrder({ id });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handeldeliveredOrder = async (id) => {
    try {
      setIsLoading(true);
      await confirmOrder({ id });
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
      await handelGetOrder(id);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen w-full bg-white dark:bg-darkBg text-black dark:text-white flex justify-center items-center pt-[60px] md:pl-[20%]">
          {"Loading..."}
        </div>
      ) : (
        <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] text-black dark:text-white">
          <div className="flex flex-col md:flex-row justify-start gap-x-4 w-full p-5">
            <table className="w-full text-start table h-fit">
              <thead className="w-full">
                <tr className="border-b-2 border-[#8C8C8C] border-opacity-20 dark:border-opacity-40 capitalize">
                  <th className="font-medium text-start text-sm text-[#5E5E5E] py-2">
                    Product
                  </th>
                  <th className="font-medium text-start text-sm text-[#5E5E5E] py-2 hidden md:block">
                    price
                  </th>
                  <th className="font-medium text-start text-sm text-[#5E5E5E] py-2">
                    Quantity
                  </th>
                  <th className="font-medium text-start text-sm text-[#5E5E5E] py-2 hidden md:block">
                    subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {order?.products &&
                  order.products.map((product) => (
                    <tr
                      key={product?._id}
                      className="border-b-2 border-[#8C8C8C] border-opacity-20 dark:border-opacity-40 capitalize"
                    >
                      <td className="py-2 max-h-[30vw]">
                        <Link
                          href={`/dashboard/products/${product?.product?.slug}`}
                          className="flex gap-x-4 h-full items-center"
                        >
                          <div className="relative aspect-[1/1.2] sm:min-h-[20vh] min-h-[10vh] bg-black">
                            <Image
                              src={
                                product?.images
                                  ? product.images[0]
                                  : "/lamp.png"
                              }
                              layout="fill"
                              objectFit="cover"
                              alt={product?.product?.title}
                            />
                          </div>
                          <div>
                            <p className="sm:text-sm text-xs font-semibold">
                              {product?.product?.title}
                            </p>
                            <p className="sm:text-sm text-xs text-gray font-medium capitalize">
                              {product?.color}
                            </p>
                            <p className="sm:text-sm text-xs text-gray font-medium capitalize">
                              {product?.size}
                            </p>
                            <p className="sm:text-sm text-xs font-semibold block md:hidden">
                              {/* Qt */}× {product?.product?.price} DZD
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="text-sm font-semibold min-w-16 max-sm:hidden">
                        {product?.product?.price} DZD
                      </td>
                      <td>{product?.quantity}</td>
                      <td className="text-sm font-semibold min-w-16 max-sm:hidden">
                        {product?.product?.price * product?.quantity} DZD
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <PricingBox
              btnLabel={"checkout"}
              className={"mt-9"}
              subtotal={order?.totalCost}
            />
          </div>
          <div className="p-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            {order?.status === "confirmed" && (
              <button
                type="button"
                onClick={async () => {
                  await handeldeliveredOrder(id);
                }}
                className="pt-2 pb-[11px] bg-yellow text-white px-8"
              >
                Delivered
              </button>
            )}
            {order?.status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={async () => {
                    await handelConfirmOrder(id);
                  }}
                  className="pt-2 pb-[11px] bg-green-200 dark:bg-opacity-90 text-green-600 px-8"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handelCancelOrder(id);
                  }}
                  className="pt-2 pb-[11px] bg-red-200 dark:bg-opacity-90 text-red-500 px-8"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </main>
      )}
    </>
  );
}
