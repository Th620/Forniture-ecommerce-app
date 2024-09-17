const PricingBox = ({
  btnLabel,
  className,
  subtotal = 0,
  shipping,
  onClick,
  checkout = false,
  checked,
  setChecked,
  disabled = false,
  btn = false,
}) => {
  return (
    <div className="md:w-[30vw] lg:w-[25vw] w-full">
      <div
        className={`w-full border-2 border-[#E8E9EB]  dark:bg-darkBg dark:border-[#8C8C8C] dark:border-opacity-40 h-fit capitalize ${className}`}
      >
        <h4 className="px-5 font-semibold text-lg py-3">Your order</h4>
        <hr className="border-[1.5px] border-[#E8E9EB] dark:border-[#8C8C8C] dark:border-opacity-40 mx-5" />
        <div className="flex items-center justify-between px-5 py-3 text-sm font-medium">
          <p>Subtotal</p>
          <p className="font-semibold">{subtotal} DZD</p>
        </div>
        <hr className="border-[1.5px] border-[#E8E9EB] dark:border-[#8C8C8C] dark:border-opacity-40 mx-5" />
        <div className="flex items-start justify-between gap-4 px-5 py-3 text-sm font-medium">
          <p>shipping</p>
          <p className="font-semibold w-fit text-justify">
            {shipping ? `${shipping} DZD` : "based on address"}
          </p>
        </div>
        <div className="flex items-center justify-between px-5 py-3 text-sm font-medium bg-[#E8E9EB] dark:bg-[#8C8C8C]">
          <p>Total</p>
          <p className="font-semibold">
            {shipping ? subtotal + shipping : subtotal} DZD
          </p>
        </div>
      </div>
      {checkout && (
        <div className="my-2">
          <h4 className="font-semibold">Paymant method</h4>
          <label
            htmlFor="paymantMethod"
            className="ml-4 flex items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              name="paymantMethod"
              id="paymantMethod"
              value={"cash on delivery"}
              checked={checked}
              onChange={() => setChecked((prev) => !prev)}
            />
            Cash on delivery
          </label>
        </div>
      )}

      {btn && (
        <button
          type={btnLabel === "place order" ? "submit" : "button"}
          onClick={btnLabel !== "place order" ? onClick : () => {}}
          disabled={disabled}
          className="uppercase pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white w-full mt-4 disabled:opacity-80"
        >
          {btnLabel}
        </button>
      )}
    </div>
  );
};

export default PricingBox;
