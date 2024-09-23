"use client";

import Loading from "@/app/loading";
import Pagination from "@/components/Pagination";
import { getUserOrders } from "@/services/order";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineErrorOutline } from "react-icons/md";

export default function Orders() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  const router = useRouter();

  const searchParams = useSearchParams();

  const searchParamsValues = Object.fromEntries([...searchParams]);

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPageCount, setTotalPageCount] = useState(0);

  const handleGetOrders = async (searchParamsValues) => {
    try {
      const { data, headers } = await getUserOrders(searchParamsValues);
      if (data) {
        setOrders(data);
        if (JSON.parse(headers.get("X-TotalPagecount"))) {
          setTotalPageCount(JSON.parse(headers.get("X-TotalPagecount")));
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ Error: error.message });
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetOrders(searchParamsValues);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="w-full h-screen text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
          <MdOutlineErrorOutline className="md:text-lg text-3xl" />
          {error.Error}
        </div>
      ) : (
        <main className="flex flex-col justify-start items-center gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14 mt-150 min-h-screen mb-14">
          <h2 className="text-[32px] font-semibold capitalize self-start">
            Orders
          </h2>
          <table className="w-full text-start table">
            <thead className="w-full">
              <tr className="border-b-2 border-[#E8E9EB] capitalize">
                <th className="font-medium text-center w-10 text-sm text-[#5E5E5E] py-2">
                  #
                </th>
                <th className="font-medium text-start text-sm text-[#5E5E5E] py-2 w-[30%]">
                  order
                </th>
                <th className="font-medium text-start text-sm text-[#5E5E5E] py-2 hidden sm:table-cell">
                  date
                </th>
                <th className="font-medium text-start text-sm text-[#5E5E5E] py-2 hidden sm:table-cell">
                  price
                </th>
                <th className="font-medium text-center w-fit sm:w-40 text-sm text-[#5E5E5E] py-2">
                  status
                </th>
              </tr>
            </thead>
            <tbody>
              {(!orders || orders.length === 0) && (
                <tr className="text-xs h-10">
                  <td
                    colSpan={6}
                    className="font-medium text-center min-w-7 table-cell text-base"
                  >
                    <div className="w-full py-7 flex justify-center items-center">
                      {"No orders yet"}
                    </div>
                  </td>
                </tr>
              )}
              {orders.map((order, index) => (
                <tr
                  key={order?._id}
                  className="text-xs h-10 border-b-2 border-[#E8E9EB]"
                >
                  <td className="font-medium min-w-7 text-center">
                    {index + 1 + (currentPage - 1) * 5}
                  </td>
                  <td className="font-semibold pr-4 min-w-10">
                    <Link href={`/orders/${order?._id}`}>{order?._id}</Link>
                  </td>
                  <td className="hidden sm:table-cell min-w-fit w-44 font-semibold">
                    {new Date(order?.createdAt).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="font-semibold hidden sm:table-cell min-w-fit w-44">
                    {order?.totalCost} DZD
                  </td>
                  <td className="flex justify-center items-center h-10 w-fit sm:w-40">
                    <div
                      className={`font-semibold py-1.5 w-20 sm:w-24 rounded-full text-[10px] sm:text-xs text-center capitalize  ${
                        order?.status === "canceled" &&
                        " bg-red-200 dark:bg-opacity-90 text-red-500 "
                      } ${
                        order?.status === "delivered" &&
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPageCount={totalPageCount}
            onPageChange={async (page) => {
              setCurrentPage(page);
              router.replace(
                `http://localhost:3000/orders?${new URLSearchParams({
                  ...searchParamsValues,
                  page,
                })}`
              );
              await handleGetOrders({
                ...searchParamsValues,
                page,
              });
            }}
          />
        </main>
      )}
    </>
  );
}
