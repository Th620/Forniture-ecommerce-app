"use client";

import { BASE_URL } from "@/constants";
import { removeItem } from "@/lib/features/cart/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CgClose } from "react-icons/cg";
import { FaLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

const MobileCart = ({ openCart, setOpenCart }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const router = useRouter();

  return (
    <div
      onMouseOver={() => setOpenCart(true)}
      onMouseLeave={() => setOpenCart(false)}
      className={`fixed top-0 ${
        openCart ? "left-0" : "left-full"
      }  bottom-0 h-screen w-full bg-white pt-2 pb-4 px-10 md:hidden rounded-md flex flex-col z-[100]`}
    >
      <h3 className="font-semibold text-3xl text-center capitalize mb-10">
        Cart
      </h3>
      <div className="w-full overflow-y-scroll">
        {cart.items?.map((item) => (
          <div className="flex items-stretch border-b-[1.5px] border-gray border-opacity-20 py-2">
            <Link href={`/products/${item?.slug}`}>
              <div className="relative aspect-[1/1.2] w-[20vw] bg-bg mr-2">
                <Image
                  src={item?.image ? BASE_URL + item.image : "/not-found.png"}
                  layout="fill"
                  objectFit="cover"
                  alt={item?.title}
                />
              </div>
            </Link>
            <div className="h-full text-xl">
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
              className="p-1.5 self-center rounded-full bg-[#E8E9EB] hover:bg-[#DDDEE0] transition-colors duration-100 ml-auto"
            >
              <CgClose className="size-3 text-[#5E5E5E]" />
            </button>
          </div>
        ))}
      </div>
      <div className="flew flex-col w-full mt-auto">
        <div className="flex self-end items-center justify-between capitalize py-2 border-b-[1.5px] border-gray border-opacity-20 w-full">
          <p>sunbtotal:</p>
          <p className="text-sm text-[#8C8C8C]">{cart.totalPrice} DZD</p>
        </div>
        <div className="text-sm content-end w-full">
          <button
            type="button"
            onClick={() => router.push("/cart", { scroll: true})}
            className="w-full py-2 text-white font-lato text-center bg-yellow uppercase mt-4"
          >
            view cart
          </button>
          <button
            type="button"
            onClick={() => router.push("/checkout", { scroll: true})}
            className="w-full py-2 text-white font-lato text-center bg-navy hover:bg-navyHover transition-colors duration-150 uppercase my-2"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCart;
