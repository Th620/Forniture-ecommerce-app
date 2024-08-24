import Link from "next/link";
import React from "react";
import { MdOutlineDelete, MdOutlineModeEdit } from "react-icons/md";

const orders = [
  {
    id: "00c64832-8fae-492f-a535-5d8f169cc947",
    date: "20/07/2024",
    shippingDate: "20/07/2024",
    price: "$25.00",
    status: "canceled",
  },
  {
    id: "fb04fb35-590d-4375-8bfc-a84c823cadc9",
    date: "22/07/2024",
    shippingDate: "22/07/2024",
    price: "$25.00",
    status: "dilevered",
  },
];

export default function Clients() {
  return (
    <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] text-black dark:text-white">
      <div className="p-5 w-full">
        <table className="w-full text-start table">
          <thead className="w-full">
            <tr className="border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 capitalize">
              <th className="font-medium text-center hidden sm:table-cell w-10 text-sm text-[#8C8C8C] py-2">
                #
              </th>
              <th className="font-medium text-start text-sm text-[#8C8C8C] py-2">
                order
              </th>
              <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 hidden sm:table-cell">
                date
              </th>
              <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 hidden md:table-cell">
                shipping date
              </th>
              <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 hidden sm:table-cell">
                price
              </th>
              <th className="font-medium text-center w-fit sm:w-40 text-sm text-[#8C8C8C] py-2">
                status
              </th>
              <th className="font-medium text-center w-fit sm:w-40 text-sm text-[#8C8C8C] py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className="text-xs h-10 border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40"
              >
                <td className="font-medium min-w-7 text-center hidden sm:table-cell">
                  {index}
                </td>
                <td className="font-semibold pr-4 min-w-10 w-72">
                  <Link href={""}>{order.id}</Link>
                </td>
                <td className="font-medium hidden sm:table-cell min-w-fit w-40 ">
                  {order.date}
                </td>
                <td className="font-medium hidden md:table-cell min-w-fit w-44">
                  {order.shippingDate}
                </td>
                <td className="font-semibold hidden sm:table-cell min-w-fit w-44">
                  {order.price}
                </td>
                <td className="flex justify-center items-center h-10 w-fit sm:w-40 px-2">
                  <div
                    className={`font-semibold py-1.5 w-20 sm:w-24 rounded-full text-[10px] sm:text-xs text-center capitalize ${
                      order.status === "canceled" &&
                      "bg-red-200 dark:bg-opacity-90 text-red-500"
                    } ${
                      order.status === "dilevered" &&
                      "bg-green-200 dark:bg-opacity-90 text-green-600"
                    }`}
                  >
                    {order.status}
                  </div>
                </td>
                <td className="font-semibold table-cell md:w-[8%] min-w-14">
                  <button type="button" className="px-1">
                    <MdOutlineModeEdit className="size-[18px] text-[#8C8C8C] dark:text-bg" />
                  </button>
                  <button type="button" className="px-1">
                    <MdOutlineDelete className="size-[18px] text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
