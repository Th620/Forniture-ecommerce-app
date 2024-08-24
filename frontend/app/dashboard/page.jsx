import DashboardCard from "@/components/DashboardCard";
import EarningsChart from "@/components/EarningsChart";
import OrdersChart from "@/components/OrdersChart";

export default function Dashboard() {
  return (
    <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%]">
      <div className="grid grid-cols-12 p-5 gap-4 w-full">
        <DashboardCard
          className={"md:col-span-3 sm:col-span-6 col-span-12"}
          boxTitel={"product sold"}
          value={1000}
          percentage={+10}
          period={"mounth"}
        />
        <DashboardCard
          className={"md:col-span-3 sm:col-span-6 col-span-12"}
          boxTitel={"total profit"}
          value={1500}
          percentage={+16}
          period={"mounth"}
          sign="DZD"
        />
        <DashboardCard
          className={"md:col-span-3 sm:col-span-6 col-span-12"}
          boxTitel={"new customers"}
          value={56}
          percentage={-5}
          period={"mounth"}
        />
        <DashboardCard
          className={"md:col-span-3 sm:col-span-6 col-span-12"}
          boxTitel={"total orders"}
          value={78}
          percentage={+12}
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
    </main>
  );
}
