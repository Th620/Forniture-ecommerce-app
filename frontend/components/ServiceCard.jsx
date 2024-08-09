import Link from "next/link";
import React from "react";

const ServiceCard = ({ className, service }) => {
  return (
    <div
      className={`${className} w-full aspect-square font-montserrat text-[#828385] rounded-sm bg-bg py-6 lg:py-14 flex flex-col justify-center items-center`}
    >
      <Link
        href={"/"}
        className="w-full sm:w-auto flex flex-col justify-center items-center gap-y-2 text-center text-[12px] sm:text-lg font-semibold"
      >
        {service.icon}
        {service.title}
      </Link>
    </div>
  );
};

export default ServiceCard;
