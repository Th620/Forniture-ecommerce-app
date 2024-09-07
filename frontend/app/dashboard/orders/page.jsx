"use client";

import OrdersFilterPopUp from "@/components/OrdersFilterPopUp";
import Pagination from "@/components/Pagination";
import { getOrders } from "@/services/order";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import { MdOutlineDelete, MdOutlineModeEdit } from "react-icons/md";
import { RiUserReceived2Line } from "react-icons/ri";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const searchParamsValues = Object.fromEntries([...searchParams]);

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPageCount, setTotalPageCount] = useState(0);

  const handelConfirmOrder = async (id) => {
    try {
      if (confirm("Are you sure you want to confirm this Order?")) {
        setIsLoading(true);
        await confirmOrder({ id });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handelGetOrders = async (searchParamsValues) => {
    try {
      const { data, headers } = await getOrders(searchParamsValues);
      if (data) {
        setOrders(data);

        if (JSON.parse(headers.get("X-TotalPagecount"))) {
          setTotalPageCount(JSON.parse(headers.get("X-TotalPagecount")));
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      setError({ handlers: true, Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const filterFn = async ({ period, status }) => {
    let queries = {};
    if (period && period.toLowerCase() !== "all") {
      queries.period = period;
    }
    if (status && status.toLowerCase() !== "all") {
      queries.status = status;
    }

    router.push(`?${new URLSearchParams(queries)}`);
    setOpenFilter(false);

    await handelGetOrders(queries);
  };

  useEffect(() => {
    return async () => {
      await handelGetOrders(searchParamsValues);
    };
  }, []);

  return (
    <>
      {isLoading && !openFilter ? (
        <div className="min-h-screen w-full bg-white dark:bg-darkBg text-black dark:text-white flex justify-center items-center pt-[60px] md:pl-[20%]">
          {"Loading..."}
        </div>
      ) : (
        <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] text-black dark:text-white">
          {openFilter && (
            <OrdersFilterPopUp
              setOpenFilter={setOpenFilter}
              filterFn={filterFn}
              className={"top-[60px] left-0 md:left-[20%] right-0 bottom-0"}
            />
          )}
          <div className="p-5 w-full flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                setOpenFilter(true);
              }}
              className="flex justify-center items-center self-end gap-2 capitalize text-sm font-medium  transition-colors duration-150 bg-yellow px-5 py-2 rounded-md text-white border border-gray border-opacity-30 dark:border-opacity-5 cursor-pointer"
            >
              <HiOutlineFilter />
              filter
            </button>
            <table className="w-full text-start table">
              <thead className="w-full">
                <tr className="border-b-2 border-[#8C8C8C] border-opacity-20 dark:border-opacity-40 capitalize">
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
                  <th className="font-medium text-start text-sm text-[#8C8C8C] py-2  sm:table-cell">
                    total cost
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
                    key={order?._id}
                    className="text-xs h-10 border-b-2 border-opacity-20 border-[#8C8C8C] dark:border-opacity-40"
                  >
                    <td className="py-4 font-medium min-w-7 text-center hidden sm:table-cell">
                      {index + 1 + 10 * (currentPage - 1)}
                    </td>
                    <td className="py-4 font-semibold pr-4 min-w-10 w-72">
                      <Link href={`/dashboard/orders/${order?._id}`}>
                        {order?._id}
                      </Link>
                    </td>
                    <td className="py-4 font-medium hidden sm:table-cell min-w-fit w-40 ">
                      {new Date(order?.createdAt).toLocaleDateString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 font-medium hidden md:table-cell min-w-fit w-44">
                      {order?.shippingDate ? order?.shippingDate : "-"}
                    </td>
                    <td className="py-4 font-semibold table-cell min-w-fit w-44">
                      {order?.totalCost} DZD
                    </td>
                    <td className="py-7 flex justify-center max-sm:hidden items-center h-10 w-fit sm:w-40 px-2">
                      <div
                        className={`font-semibold py-1.5 cursor-default w-20 sm:w-24 rounded-full text-[10px] sm:text-xs text-center capitalize  ${
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
                      </div>
                    </td>
                    <td className="py-4 font-semibold table-cell md:w-[12%] min-w-14">
                      {order?.status === "dilevered" ? (
                        <button type="button" className="px-1">
                          <RiUserReceived2Line className="size-[18px] max-sm:hidden text-[#8C8C8C] dark:text-bg" />
                        </button>
                      ) : (
                        <button type="button" className="px-1 max-sm:hidden">
                          <FaRegCircleCheck
                            className={`size-[18px] ${
                              (order?.status === "confirmed" ||
                                order?.status === "dilevered") &&
                              " text-green-600 "
                            } ${
                              order?.status === "canceled" &&
                              "  text-red-400 cursor-not-allowed "
                            }${
                              order?.status === "pending" &&
                              " text-[#8C8C8C] dark:text-bg"
                            }`}
                          />
                        </button>
                      )}

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
            <Pagination
              currentPage={currentPage}
              totalPageCount={totalPageCount}
              onPageChange={async (page) => {
                setCurrentPage(page);
                router.push(
                  `http://localhost:3000/dashboard/orders?${new URLSearchParams(
                    {
                      ...searchParamsValues,
                      page,
                    }
                  )}`
                );
                await handelGetOrders({
                  ...searchParamsValues,
                  page,
                });
              }}
              searchParamsValues={searchParamsValues}
            />
          </div>
        </main>
      )}
    </>
  );
}
