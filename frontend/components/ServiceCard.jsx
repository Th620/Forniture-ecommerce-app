import Link from "next/link";
import React from "react";

const ServiceCard = ({ className, service }) => {
  return (
    <div className={`${className} w-full font-montserrat text-gray py-6 lg:py-14`}>
      <Link
        href={"/"}
        className="w-full sm:w-auto flex flex-col justify-center items-center gap-y-2 tracking-wider text-center text-sm sm:text-xl leading-tight font-semibold"
      >
        {service.icon}
        {service.title}
      </Link>
    </div>
  );
};

export default ServiceCard;
