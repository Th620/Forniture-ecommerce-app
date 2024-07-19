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
      <h6>
        Fast <br /> Delivry
      </h6>
    ),
    icon: <TbTruckDelivery className="text-[56px] sm:text-[80px]" />,
  },
  {
    id: 2,
    title: (
      <h6>
        Secure <br /> Paymant
      </h6>
    ),
    icon: <MdPayment className="text-[56px] sm:text-[80px]" />,
  },
  {
    id: 3,
    title: (
      <h6>
        Free <br /> Return
      </h6>
    ),
    icon: <MdOutlineChangeCircle className="text-[56px] sm:text-[80px]" />,
  },
  {
    id: 4,
    title: (
      <h6>
        F&Q <br /> Service
      </h6>
    ),
    icon: <RiCustomerServiceLine className="text-[56px] sm:text-[80px]" />,
  },
];

const ServicesSection = () => {
  return (
    <section className="pb-14 w-full bg-white px-10 md:px-75 lg:px-150 grid gap-x-4 sm:gap-0 lg:gap-4 grid-cols-4">
      {services.map((service) => (
        <ServiceCard service={service} key={service.id} className={'col-span-2 md:col-span-1'} />
      ))}
    </section>
  );
};

export default ServicesSection;
