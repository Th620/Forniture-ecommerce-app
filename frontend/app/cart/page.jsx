import PricingBox from "@/components/PricingBox";
import Image from "next/image";
import Link from "next/link";
import { CgClose } from "react-icons/cg";
import { GoArrowLeft } from "react-icons/go";

const CardProdcuts = [
  {
    id: 1,
    title: "Desk Lamp",
    img: "/lamp.png",
    filter: {
      color: "black",
    },
    price: 25.0,
  },
  {
    id: 2,
    title: "Desk Lamp",
    img: "/lamp.png",
    filter: {
      color: "black",
    },
    price: 25.0,
  },
  {
    id: 3,
    title: "Desk Lamp",
    img: "/lamp.png",
    filter: {
      color: "black",
    },
    price: 25.0,
  },
];

export default function Cart() {
  return (
    <main className="flex flex-col justify-start gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14 mt-150 min-h-screen mb-14">
      <h2 className="text-[32px] font-semibold capitalize">cart</h2>
      <div className="flex flex-col md:flex-row justify-center gap-x-4 xl:gap-x-6 w-full">
        <form className="w-full min-w-1/2">
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
              {CardProdcuts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b-2 border-[#E8E9EB] h-fit"
                >
                  <td className="py-2 max-h-[30vw]">
                    <Link
                      href={"/"}
                      className="flex gap-x-4 h-full items-center"
                    >
                      <div className="relative aspect-[1/1.2] sm:min-h-[20vh] min-h-[10vh] bg-black">
                        <Image
                          src={product.img}
                          layout="fill"
                          objectFit="cover"
                          alt={product.title}
                        />
                      </div>
                      <div>
                        <p className="sm:text-sm text-xs font-semibold">
                          {product.title}
                        </p>
                        <p className="sm:text-sm text-xs text-gray font-medium capitalize">
                          {product.filter.color}
                        </p>
                        <p className="sm:text-sm text-xs font-semibold block md:hidden">
                          {/* Qt */}× ${product.price}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="text-sm font-semibold min-w-16 max-sm:hidden">
                    ${product.price}
                  </td>
                  <td>
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
                  </td>
                  <td className="text-sm font-semibold min-w-16 max-sm:hidden">
                    ${product.price}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="p-1.5 rounded-full bg-[#E8E9EB] hover:bg-[#DDDEE0] transition-colors duration-100 hidden sm:block"
                    >
                      <CgClose className="size-3 text-[#5E5E5E]" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} className="table-cell">
                  <div className="items-center gap-x-4 gap-y-2 flex-wrap w-full pt-7 flex">
                    <button
                      type="button"
                      className="inline capitalize min-w-56 pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white"
                    >
                      Update Cart
                    </button>
                    <button
                      type="button"
                      className="capitalize min-w-56 pt-2 pb-[11px] font-medium text-black inline-flex justify-center items-center gap-x-2"
                    >
                      <GoArrowLeft className="text-lg" />
                      Continue Shopping
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <PricingBox btnLabel={"checkout"} className={"mt-9"} />
      </div>
    </main>
  );
}
