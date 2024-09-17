import { setShippingDate } from "@/services/order";
import { MdErrorOutline } from "react-icons/md";

const ShippingDatePopUp = ({
  label,
  setOpenShippingDatePopUp,
  date,
  setIsLoading,
  setDate,
  setError,
  error = null,
  id,
}) => {
  const handleSetShippingDate = async (shippingDate) => {
    try {
      setIsLoading(true);
      await setShippingDate({ id, shippingDate });
      setIsLoading(false);
      setOpenShippingDatePopUp(false);
    } catch (error) {
      setError({ Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  console.log(error);

  return (
    <div
      className={`fixed z-20 bg-[#282828b1] top-0 left-0 flex items-center justify-center font-montserrat w-full h-screen pt-[60px] md:pl-[20%]`}
    >
      <div
        className={`dark:bg-darkBg  w-3/4 md:w-1/3 rounded-sm bg-white flex flex-col justify-center px-8 py-6`}
      >
        <label htmlFor={"country"} className="mb-2">
          Shipping Date:
        </label>
        {error && (
          <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
            <MdErrorOutline className="size-4" />
            {error?.Error}
          </div>
        )}
        <input
          type={"date"}
          name={"date"}
          id={"date"}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
          className={`mt-2 h-10 bg-bg dark:bg-darkBody outline-none text-sm font-medium placeholder:text-gray  placeholder:dark:text-opacity-40 placeholder:text-sm px-4 rounded-sm
        }`}
        />
        <div className="flex items-center justify-start gap-4 my-4">
          <button
            type="button"
            onClick={async () => {
              await handleSetShippingDate(new Date(date));
            }}
            className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-yellow px-4 h-10 rounded-md text-white cursor-pointer w-fit"
          >
            {label}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenShippingDatePopUp(false);
            }}
            className="flex justify-center items-center gap-2 capitalize text-sm font-medium px-4 h-10 rounded-md dark:text-white text-black cursor-pointer w-fit"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingDatePopUp;
