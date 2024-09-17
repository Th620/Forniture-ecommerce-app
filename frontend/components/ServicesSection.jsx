import React from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { MdPayment } from "react-icons/md";
import { MdOutlineChangeCircle } from "react-icons/md";
import { RiCustomerServiceLine } from "react-icons/ri";
import ServiceCard from "./ServiceCard";

const services = [
  {
    id: 1,
    title: (
      <h6 className="leading-tight">
        Fast <br /> Delivry
      </h6>
    ),
    icon: <TbTruckDelivery className="sm:text-[64px] text-[40px]" />,
  },
  {
    id: 2,
    title: (
      <h6 className="leading-tight">
        Secure <br /> Paymant
      </h6>
    ),
    icon: <MdPayment className="sm:text-[64px] text-[40px]" />,
  },
  {
    id: 3,
    title: (
      <h6 className="leading-tight">
        Free <br /> Return
      </h6>
    ),
    icon: <MdOutlineChangeCircle className="sm:text-[64px] text-[40px]" />,
  },
  {
    id: 4,
    title: (
      <h6 className="leading-tight">
        F&Q <br /> Service
      </h6>
    ),
    icon: <RiCustomerServiceLine className="sm:text-[64px] text-[40px]" />,
  },
];

const ServicesSection = () => {
  return (
    <section className="my-28 w-full bg-white px-10 md:px-75 lg:px-150 grid gap-4 grid-cols-4 mb-[168px]">
      {services.map((service) => (
        <ServiceCard
          service={service}
          key={service.id}
          className={"col-span-2 md:col-span-1"}
        />
      ))}
    </section>
  );
};

export default ServicesSection;
