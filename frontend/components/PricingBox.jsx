import React from "react";

const PricingBox = ({ btnLabel, className }) => {
  return (
    <div className="md:w-[30vw] lg:w-[25vw] w-full">
      <div className={`w-full border-2 border-[#E8E9EB] h-fit capitalize ${className}`}>
        <h4 className="px-5 font-semibold text-lg py-3">Your order</h4>
        <hr className="border-[1.5px] border-[#E8E9EB] mx-5" />
        <div className="flex items-center justify-between px-5 py-3 text-sm font-medium">
          <p>Subtotal</p>
          <p className="font-semibold">$25.00</p>
        </div>
        <hr className="border-[1.5px] border-[#E8E9EB] mx-5" />
        <div className="flex items-center justify-between px-5 py-3 text-sm font-medium">
          <p>shipping</p>
          <p className="font-semibold">$5.00</p>
        </div>
        <div className="flex items-center justify-between px-5 py-3 text-sm font-medium bg-[#E8E9EB]">
          <p>Total</p>
          <p className="font-semibold">$30.00</p>
        </div>
      </div>
      <button
        type="button"
        className="uppercase pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white w-full mt-4"
      >
        {btnLabel}
      </button>
    </div>
  );
};

export default PricingBox;
