"use client";

import PricingBox from "@/components/PricingBox";
import { BASE_URL } from "@/constants";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "@/lib/features/cart/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CgClose } from "react-icons/cg";
import { GoArrowLeft } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <main className="flex flex-col justify-start px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14 mt-[100px] min-h-screen mb-14">
      <h2 className="text-[32px] font-semibold capitalize mb-6">cart</h2>
      <div className="flex flex-col md:flex-row justify-center gap-x-4 xl:gap-x-6 w-full">
        <div className="w-full min-w-1/2">
          <table className="w-full text-start table">
            <thead className="w-full">
              <tr className="border-b-2 border-[#E8E9EB]">
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
              {cart?.items.map((item) => (
                <tr
                  key={item?.id}
                  className="border-b-2 border-[#E8E9EB] h-fit"
                >
                  <td className="py-2 max-h-[30vw]">
                    <Link
                      href={"/"}
                      className="flex gap-x-4 h-full items-center"
                    >
                      <div className="relative aspect-[1/1.2] w-[6vw] bg-bg">
                        <Image
                          src={
                            item?.image ? BASE_URL + item.image : "/lamp.png"
                          }
                          layout="fill"
                          objectFit="cover"
                          alt={item?.title}
                        />
                      </div>
                      <div>
                        <p className="sm:text-sm text-xs font-semibold">
                          {item?.title}
                        </p>
                        <p className="sm:text-sm text-xs text-gray font-medium capitalize">
                          {item?.color}
                        </p>
                        <p className="sm:text-sm text-xs text-gray font-medium capitalize">
                          {item?.size}
                        </p>
                        <p className="sm:text-sm text-xs font-semibold block md:hidden">
                          {item?.quantity}× {item?.price} DZD
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="text-sm font-semibold min-w-16 max-sm:hidden">
                    {item?.price} DZD
                  </td>
                  <td>
                    <div className="sm:h-8 h-6 bg-gray flex justify-center items-center w-fit text-white">
                      <button
                        type="button"
                        onClick={() => {
                          if (item?.quantity > 1) {
                            dispatch(
                              decreaseQuantity({
                                _id: item?._id,
                                color: item?.color,
                                size: item?.size,
                              })
                            );
                          } else {
                            dispatch(
                              removeItem({
                                _id: item?._id,
                                color: item?.color,
                                size: item?.size,
                              })
                            );
                          }
                        }}
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
                        value={item?.quantity}
                        readOnly
                        className="h-full text-center bg-gray"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(
                            increaseQuantity({
                              _id: item?._id,
                              color: item?.color,
                              size: item?.size,
                            })
                          );
                        }}
                        className="h-full aspect-square flex justify-center items-center font-semibold hover:bg-grayHover transition-colors duration-100"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-sm font-semibold min-w-16 max-sm:hidden">
                    {item?.price * item?.quantity} DZD
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(
                          removeItem({
                            _id: item?._id,
                            color: item?.color,
                            size: item?.size,
                          })
                        );
                      }}
                      className="p-1.5 rounded-full bg-[#E8E9EB] hover:bg-[#DDDEE0] transition-colors duration-100 hidden sm:block"
                    >
                      <CgClose className="size-3 text-[#5E5E5E]" />
                    </button>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={5} className="table-cell">
                  {cart?.totalQuantity === 0 && (
                    <div className="w-full py-6 text-center text-[#8C8C8C] bg-bg">
                      Empty
                    </div>
                  )}

                  <div className="items-center gap-x-4 gap-y-2 flex-wrap w-full pt-7 flex">
                    <button
                      type="button"
                      onClick={() => router.push("/products")}
                      className="capitalize pt-2 pb-[11px] font-medium text-black inline-flex justify-center items-center gap-x-2 transition-all duration-500 hover:gap-x-3"
                    >
                      <GoArrowLeft className="text-lg" />
                      Continue Shopping
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <PricingBox
          btnLabel={"checkout"}
          className={"mt-9"}
          subtotal={cart?.totalPrice}
        />
      </div>
    </main>
  );
}
