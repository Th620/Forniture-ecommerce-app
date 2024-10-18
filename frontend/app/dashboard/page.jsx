"use client";

import DashboardCard from "@/components/DashboardCard";
import EarningsChart from "@/components/EarningsChart";
import OrdersChart from "@/components/OrdersChart";
import { productSoldAndProfits } from "@/services/order";
import { useEffect, useState } from "react";
import { MdError, MdOutlineError, MdOutlineErrorOutline } from "react-icons/md";
import Loading from "../loading";

export default function Dashboard() {
  const [profits, setprofits] = useState(0);
  const [profitsPercentage, setprofitsPercentage] = useState(0);
  const [productsSoldPercentage, setproductsSoldPercentage] = useState(0);
  const [productSold, setproductSold] = useState(0);
  const [orders, setOrders] = useState(0);
  const [ordersPercentage, setOrdersPercentage] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [customersPercentage, setCustomersPercenrage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGetProductSoldAndProfits = async () => {
    try {
      const data = await productSoldAndProfits();
      if (data) {
        setprofits(data?.profits);
        setprofitsPercentage(data?.profitsPercentage);
        setproductSold(data?.productSold);
        setproductsSoldPercentage(data?.productSlodPercentage);
        setOrders(data?.orders);
        setOrdersPercentage(data?.ordersPercentage);
        setCustomers(data?.customers);
        setCustomersPercenrage(data?.customerPercentage);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetProductSoldAndProfits();
      setIsLoading(false);
    };
  }, []);

  return (
    <>
      {isLoading && <Loading className={"dash-load max-md:p-0"} />}
      {!isLoading && (
        <main className="min-h-screen w-full relative bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%]">
          {error ? (
            <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] inline-flex justify-center items-center p-5 md:p-10">
              <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
                <MdOutlineErrorOutline className="md:text-lg text-3xl" />
                {error.Error}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 p-5 gap-4 w-full">
              <DashboardCard
                className={"md:col-span-3 sm:col-span-6 col-span-12"}
                boxTitel={"product sold"}
                value={productSold}
                percentage={Math.round(productsSoldPercentage * 10) / 10}
                period={"mounth"}
              />
              <DashboardCard
                className={"md:col-span-3 sm:col-span-6 col-span-12"}
                boxTitel={"total profit"}
                value={profits}
                percentage={Math.round(profitsPercentage * 10) / 10}
                period={"mounth"}
                sign="DZD"
              />
              <DashboardCard
                className={"md:col-span-3 sm:col-span-6 col-span-12"}
                boxTitel={"new customers"}
                value={customers}
                percentage={customersPercentage}
                period={"mounth"}
              />
              <DashboardCard
                className={"md:col-span-3 sm:col-span-6 col-span-12"}
                boxTitel={"total orders"}
                value={orders}
                percentage={customersPercentage}
                period={"mounth"}
              />
              <div className="relative col-span-12 md:col-span-7 h-72 text-[10px] p-4 bg-white dark:bg-darkBg border border-gray border-opacity-30 dark:border-opacity-5 rounded-md">
                <h3 className="absolute left-5 top-3 text-lg font-medium text-black dark:text-white">
                  Earning
                </h3>
                <EarningsChart />
              </div>
              <div className="relative col-span-12 md:col-span-5 h-72 text-[10px] p-4 bg-white dark:bg-darkBg border border-gray border-opacity-30 dark:border-opacity-5 rounded-md">
                <h3 className="absolute left-5 top-3 text-lg font-medium text-black dark:text-white">
                  Orders
                </h3>
                <OrdersChart />
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
}
