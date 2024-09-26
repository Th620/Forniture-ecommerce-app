"use client";

import { useRouter } from "next/navigation";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import { TbEqual } from "react-icons/tb";

const DashboardCard = ({
  className,
  boxTitel,
  value,
  percentage,
  link,
  period,
  sign = "",
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (link) {
          router.push(link, { scroll: true});
        }
      }}
      className={`${className} bg-white hover:bg-[#F7F8FA] dark:bg-darkBg dark:hover:bg-[#252528] transition-colors duration-150 rounded-md py-3 px-3 flex flex-col border border-gray border-opacity-30 dark:border-opacity-5 cursor-pointer`}
    >
      <h3 className="capitalize text-[#8C8C8C] text-sm">{boxTitel}</h3>
      <p className="text-lg text-black font-bold py-[10px] dark:text-white">
        {value} {sign}
      </p>
      <div className="flex gap-1 items-center">
        {percentage > 0 ? (
          <FaArrowTrendUp className="text-green-400 size-[14px]" />
        ) : percentage === 0 ? (
          <TbEqual className="text-orange-300 size-[14px]" />
        ) : (
          <FaArrowTrendDown className="text-red-400 size-[14px]" />
        )}
        <p className="text-black dark:text-bg text-xs flex items-center gap-1">
          <span
            className={`${
              percentage < 0
                ? "text-red-400"
                : percentage === 0
                ? "text-orange-300"
                : "text-green-400"
            }`}
          >
            {percentage}%
          </span>
          from last {period}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
