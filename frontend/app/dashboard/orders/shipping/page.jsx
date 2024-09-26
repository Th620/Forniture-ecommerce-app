"use client";

import Pagination from "@/components/Pagination";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCalendarDateFill } from "react-icons/bs";
import DateFilter from "@/components/DateFilter";
import { deliverOrder, getOrdersToShip } from "@/services/order";
import Loading from "@/app/loading";
import { MdOutlineErrorOutline } from "react-icons/md";
import { FaRegCircleRight } from "react-icons/fa6";

export default function OrderToShip() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    +searchParams.get("page") || 1
  );

  const [totalPageCount, setTotalPageCount] = useState(0);

  const [filter, setFilter] = useState(searchParams.get("d") || "");

  const [openfilter, setOpenFilter] = useState(null);

  const handleGetShipping = async (page, d) => {
    try {
      const response = await getOrdersToShip({ page, shippingDate: d });
      if (response.data) {
        setOrders(response.data);
        if (JSON.parse(response.headers?.get("x-totalpagecount"))) {
          setTotalPageCount(
            JSON.parse(response.headers.get("x-totalpagecount"))
          );
        } else {
          setTotalPageCount(0);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
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

  useEffect(() => {
    return async () => {
      await handleGetShipping(currentPage, filter);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading className={"dash-load max-md:p-0"} />
      ) : (
        <main className="min-h-screen w-full flex flex-col gap-4 bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] pb-5 text-black dark:text-white">
          {error ? (
            <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
              <MdOutlineErrorOutline className="md:text-lg text-3xl" />
              {error}
            </div>
          ) : (
            <div className="px-5 pt-4 w-full flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  setOpenFilter(true);
                }}
                className="flex justify-center items-center self-end gap-2 capitalize text-sm font-medium  transition-colors duration-150 bg-yellow px-5 py-2 rounded-md text-white border border-gray border-opacity-30 dark:border-opacity-5 cursor-pointer"
              >
                <BsCalendarDateFill />
                Date
              </button>
              <h3 className="capitalize font-semibold text-2xl mb-5 self-start">
                orders to ship
              </h3>

              <table className="w-full text-start table">
                <thead className="w-full capitalize">
                  <tr className="border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40">
                    <th className="font-medium text-start text-sm w-4 md:flex justify-center hidden items-center text-[#8C8C8C] px-5 py-2">
                      #
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2">
                      order
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2">
                      shippingDate
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2">
                      total cost
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 max-md:hidden">
                      country
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 max-md:hidden">
                      state
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 max-md:hidden">
                      city
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!orders ||
                    (orders?.length === 0 && (
                      <tr>
                        <td colSpan={6} className="table-cell">
                          <div className="text-gray py-4 text-center">
                            No orders
                          </div>
                        </td>
                      </tr>
                    ))}
                  {orders?.length > 0 &&
                    orders.map((order, index) => (
                      <tr
                        key={order?._id}
                        className="border-b-2 text-xs border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 h-[5vh] md:h-[6vh]"
                      >
                        <td className="font-semibold w-4 table-cell px-5 max-md:hidden">
                          {index + 1 + (currentPage - 1) * 4}
                        </td>

                        <td className="font-semibold md:w-[20vw]">
                          <Link
                            href={
                              order?._id ? `/dashboard/orders/${order._id}` : ""
                            }
                          >
                            {order?._id}
                          </Link>
                        </td>

                        <td className="font-medium capitalize">
                          {new Date(order?.shippingDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="capitalize font-semibold">
                          {order?.totalCost} DZD
                        </td>

                        <td className="font-medium capitalize max-md:hidden">
                          {order?.shipping?.country?.country}
                        </td>
                        <td className="font-medium capitalize max-md:hidden">
                          {order?.shipping?.state?.state}
                        </td>

                        <td className="font-medium capitalize max-md:hidden">
                          {order?.shipping?.city}
                        </td>
                        <td>
                          <button
                            type="button"
                            disabled={order?.status === "delivered"}
                            onClick={async () => {
                              await handleMarkOrderAsDelivered(order?._id);
                              await handleGetShipping(currentPage, filter)
                            }}
                            className="px-1 max-sm:hidden"
                          >
                            <abbr title="Set it to delivered">
                              <FaRegCircleRight
                                className={`size-[18px] ${
                                  order?.status === "delivered"
                                    ? "text-blue-600"
                                    : "text-[#8C8C8C] dark:text-bg"
                                }`}
                              />
                            </abbr>
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
                  router.replace(
                    `/dashboard/orders/shipping?${new URLSearchParams(
                      {
                        page,
                      }
                    )}`,
                    { scroll: true }
                  );
                  await handleGetShipping(page, filter);
                }}
              />
            </div>
          )}
          {openfilter && (
            <DateFilter
              setFilter={setFilter}
              setOpenFilter={setOpenFilter}
              handler={async (filter) =>
                await handleGetShipping(currentPage, filter)
              }
            />
          )}
        </main>
      )}
    </>
  );
}
