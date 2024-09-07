"use client";

import { useEffect, useState } from "react";
import Select from "./Select";
import { useRouter } from "next/navigation";
import { filter } from "@/constants";

const OrdersFilterPopUp = ({ className, setOpenFilter, filterFn }) => {
  const [period, setPeriod] = useState("");
  const [status, setStatus] = useState("");
  const [openPeriodSelect, setopenPeriodSelect] = useState(false);
  const [openStatusSelect, setopenStatusSelect] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn")) {
        setopenPeriodSelect(false);
        setopenStatusSelect(false);
      }
    });
  }, []);

  return (
    <div
      className={`${className} fixed z-40 bg-[#282828b1] flex items-center justify-center font-montserrat`}
    >
      <div
        className={`dark:bg-darkBg border border-gray border-opacity-30 dark:border-opacity-5  w-3/4 md:w-1/3 rounded-sm bg-white flex flex-col justify-center px-8 py-8 gap-y-6`}
      >
        <Select
          setOpenSelect={setopenStatusSelect}
          openSelect={openStatusSelect}
          select={status}
          setSelect={setStatus}
          options={["all", "pending", "confirmed", "delivered", "canceled"]}
          label={"status"}
          className={""}
          btnClassName={
            "hover:bg-bg dark:hover:bg-darkHover dark:bg-darkBg dark:hover:bg-[#242427] transition-colors duration-100"
          }
          addFn={() => {
            setopenPeriodSelect(false);
          }}
        />
        <Select
          setOpenSelect={setopenPeriodSelect}
          openSelect={openPeriodSelect}
          select={period}
          setSelect={setPeriod}
          options={["all", "today", "this week", "this month", "this year"]}
          label={"period"}
          className={""}
          btnClassName={
            "hover:bg-bg dark:hover:bg-darkHover dark:bg-darkB dark:hover:bg-[#242427] transition-colors duration-100"
          }
          addFn={() => {
            setopenStatusSelect(false);
          }}
        />

        <button
          type="button"
          onClick={() => filterFn({ period, status })}
          className="py-2 px-8 rounded-sm self-center sm:self-end bg-navy hover:bg-navyHover font-lato text-white w-fit font-medium text-sm"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default OrdersFilterPopUp;
