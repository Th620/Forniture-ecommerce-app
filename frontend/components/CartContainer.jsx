"use client";

import { BASE_URL } from "@/constants";
import { removeItem } from "@/lib/features/cart/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";

const CartContainer = ({ setOpenCart }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const router = useRouter();

  return (
    <div
      onMouseOver={() => setOpenCart(true)}
      onMouseLeave={() => setOpenCart(false)}
      className="absolute top-7 -right-36 bg-white md:w-[24vw] pt-2 pb-4 px-3 border border-gray border-opacity-40 rounded-md"
    >
      <div>
        {cart.items?.map((item) => (
          <div className="flex items-center border-b-[1.5px] border-gray border-opacity-20 py-2">
            <Link href={`/products/${item?.slug}`}>
              <div className="relative aspect-[1/1.2] w-[4vw] bg-bg mr-2">
                <Image
                  src={item?.image ? BASE_URL + item.image : "/lamp.png"}
                  layout="fill"
                  objectFit="cover"
                  alt={item?.title}
                />
              </div>
            </Link>
            <div className="h-full ">
              <Link href={`/products/${item?.slug}`}>
                <h3 className="text-wrap text-sm text-opacity-50 hover:text-opacity-100">
                  <span className="capitalize">{`${item?.title}`}</span>
                  {`-${item?.color}, ${item?.size}`}
                </h3>
              </Link>
              <p className="text-xs text-[#8C8C8C]">
                {item?.quantity} <span className="">× {item?.price} DZD</span>
              </p>
            </div>

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
              className="p-1.5 rounded-full bg-[#E8E9EB] hover:bg-[#DDDEE0] transition-colors duration-100 ml-auto"
            >
              <CgClose className="size-3 text-[#5E5E5E]" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between capitalize py-2 border-b-[1.5px] border-gray border-opacity-20">
        <p>sunbtotal:</p>
        <p className="text-sm text-[#8C8C8C]">{cart.totalPrice}</p>
      </div>
      <div className="text-sm">
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="w-full py-2 text-white font-lato text-center bg-yellow uppercase mt-4"
        >
          view cart
        </button>
        <button
          type="button"
          onClick={() => router.push("/chackout")}
          className="w-full py-2 text-white font-lato text-center bg-navy hover:bg-navyHover transition-colors duration-150 uppercase my-2"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartContainer;
