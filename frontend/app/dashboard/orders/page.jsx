"use client";

import Loading from "@/app/loading";
import OrdersFilterPopUp from "@/components/OrdersFilterPopUp";
import Pagination from "@/components/Pagination";
import ShippingDatePopUp from "@/components/ShippingDatePopUp";
import {
  confirmOrder,
  deleteOrder,
  deliverOrder,
  getOrders,
} from "@/services/order";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaList,
  FaRegCircleCheck,
  FaRegCircleRight,
  FaRegCircleXmark,
  FaRegClock,
} from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import {
  MdDelete,
  MdErrorOutline,
  MdOutlineErrorOutline,
} from "react-icons/md";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [date, setDate] = useState(null);
  const [openShippingdatePopUp, setOpenShippingdatePopUp] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const router = useRouter();

  const searchParams = useSearchParams();

  const searchParamsValues = Object.fromEntries([...searchParams]);

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const [totalPageCount, setTotalPageCount] = useState(0);

  const handleConfirmOrder = async (id) => {
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
  const handleMarkOrderAsDelivered = async (id) => {
    try {
      if (
        confirm("Are you sure that you ant to mark this order as delivered?")
      ) {
        setIsLoading(true);
        await deliverOrder({ id });
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
  const handleDeleteOrder = async (id) => {
    try {
      if (confirm("Are you sure you want to delete this order?")) {
        setIsLoading(true);
        await deleteOrder({ id });
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
  const handleGetOrders = async (searchParamsValues) => {
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
      setIsLoading(false);
      setError({ orders: true, Error: error.message });
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

    await handleGetOrders(queries);
  };

  useEffect(() => {
    return async () => {
      await handleGetOrders(searchParamsValues);
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && !openFilter ? (
        <Loading className={"dash-load max-md:p-0"} />
      ) : (
        <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] text-black dark:text-white">
          {openFilter && (
            <OrdersFilterPopUp
              setOpenFilter={setOpenFilter}
              filterFn={filterFn}
              className={"top-[60px] left-0 md:left-[20%] right-0 bottom-0"}
            />
          )}
          {openShippingdatePopUp && (
            <ShippingDatePopUp
              setError={setError}
              setOpenShippingDatePopUp={setOpenShippingdatePopUp}
              error={error}
              label={"set shipping date"}
              date={date}
              setDate={setDate}
              id={orderId}
              setIsLoading={setIsLoading}
            />
          )}
          {error?.orders ? (
            <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
              <MdOutlineErrorOutline className="md:text-lg text-3xl" />
              {error.Error}
            </div>
          ) : (
            <div className="p-5 w-full flex flex-col items-center">
              <div className="flex w-full justify-end gap-4 mb-2">
                {error && !error?.orders && (
                  <div className="mr-auto w-1/3">
                    <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                      <MdErrorOutline className="size-4" />
                      {error}
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    router.push("/dashboard/orders/shipping");
                  }}
                  className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-white transition-colors duration-150 dark:bg-darkBg dark:hover:bg-[#252528] px-4 py-2 rounded-md text-black dark:text-white border border-gray border-opacity-30 dark:border-opacity-5 cursor-pointer"
                >
                  <FaList />
                  Shipping
                </button>
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
              </div>

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
                        {new Date(order?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="py-4 font-medium hidden md:table-cell min-w-fit w-44">
                        {order?.shippingDate
                          ? new Date(order?.shippingDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "-"}
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
                      <td className="py-4 font-semibold table-cell md:w-[12%] min-w-14">
                        {order?.status === "delivered" && (
                          <button
                            type="button"
                            disabled={true}
                            className="px-1 max-sm:hidden"
                          >
                            <FaRegCircleRight
                              className={`size-[18px] text-blue-600`}
                            />
                          </button>
                        )}
                        {order?.status === "canceled" && (
                          <button
                            type="button"
                            disabled={true}
                            className="px-1 max-sm:hidden"
                          >
                            <FaRegCircleXmark
                              className={`text-red-400 size-[18px]`}
                            />
                          </button>
                        )}
                        {order?.status === "confirmed" && (
                          <button
                            type="button"
                            disabled={order?.status === "delivered"}
                            onClick={async () => {
                              await handleMarkOrderAsDelivered(order?._id);
                            }}
                            className="px-1 max-sm:hidden"
                          >
                            <abbr title="Set it to delivered">
                              <FaRegCircleRight
                                className={`size-[18px] text-[#8C8C8C] dark:text-bg`}
                              />
                            </abbr>
                          </button>
                        )}
                        {order?.status === "pending" && (
                          <button
                            type="button"
                            disabled={
                              order?.status === "canceled" ||
                              order?.status === "confirmed" ||
                              order?.status === "delivered"
                            }
                            onClick={async () => {
                              try {
                                await handleConfirmOrder(order?._id);
                                setDate(null);
                                setOrderId(order?._id);
                                setOpenShippingdatePopUp(true);
                              } catch (error) {}
                            }}
                            className="px-1 max-sm:hidden"
                          >
                            <abbr title="confirm">
                              <FaRegCircleCheck
                                className={`size-[18px] text-[#8C8C8C] dark:text-bg`}
                              />
                            </abbr>
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={
                            order?.status === "canceled" ||
                            order?.status === "delivered"
                          }
                          onClick={() => {
                            setDate(null);
                            setOrderId(order?._id);
                            setOpenShippingdatePopUp(true);
                          }}
                          className="px-1 max-sm:hidden mx-1 disabled:opacity-70 disabled:dark:text-slate-800"
                        >
                          <abbr
                            title={
                              order?.status === "canceled" ||
                              order?.status === "delivered"
                                ? ""
                                : "Delivery date"
                            }
                          >
                            <FaRegClock
                              className={`size-[18px] ${
                                true
                                  ? "dark:text-slate-400 text-slate-600"
                                  : "text-[#8C8C8C] dark:text-bg"
                              } `}
                            />
                          </abbr>
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await handleDeleteOrder(order?._id);
                          }}
                          className="px-1"
                        >
                          <MdDelete className="size-[18px] text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                className={"mt-8 mb-2"}
                currentPage={currentPage}
                totalPageCount={totalPageCount}
                onPageChange={async (page) => {
                  setCurrentPage(page);
                  router.replace(
                    `http://localhost:3000/dashboard/orders?${new URLSearchParams(
                      {
                        ...searchParamsValues,
                        page,
                      }
                    )}`
                  );
                  await handleGetOrders({
                    ...searchParamsValues,
                    page,
                  });
                }}
                searchParamsValues={searchParamsValues}
              />
            </div>
          )}
        </main>
      )}
    </>
  );
}
