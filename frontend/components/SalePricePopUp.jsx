import { setShippingDate } from "@/services/order";
import { editProduct } from "@/services/products";
import { MdErrorOutline } from "react-icons/md";

const SalePricePopUp = ({
  label,
  setOpenSalePrice,
  salePrice,
  setIsLoading,
  setSalePrice,
  setError,
  error,
  slug,
}) => {
  const handleEditProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append(
      "document",
      JSON.stringify({
        onSale: true,
        salePrice,
      })
    );

    try {
      setIsLoading(true);
      await editProduct({ slug, formData });
      setOpenSalePrice(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ handlers: true, Error: error?.message });
      setTimeout(() => setError(""), 3000);
    }
  };
  return (
    <div
      className={`fixed z-20 bg-[#282828b1] top-0 left-0 flex items-center justify-center font-montserrat w-full h-screen pt-[60px] md:pl-[20%]`}
    >
      <form
      onSubmit={handleEditProduct}
        className={`dark:bg-darkBg  w-3/4 md:w-1/3 rounded-sm bg-white flex flex-col justify-center px-8 py-6`}
      >
          <label htmlFor={"country"} className="mb-2">
            Sale Price:
          </label>
          {error && (
            <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
              <MdErrorOutline className="size-4" />
              {error?.Error}
            </div>
          )}
          <input
            type={"number"}
            name={"salePrice"}
            id={"salePrice"}
            value={salePrice}
            onChange={(e) => {
              setSalePrice(e.target.value);
            }}
            className={`mt-2 h-10 bg-bg dark:bg-darkBody outline-none text-sm font-medium placeholder:text-gray  placeholder:dark:text-opacity-40 placeholder:text-sm px-4 rounded-sm
        }`}
          />
          <div className="flex items-center justify-start gap-4 my-4">
            <button
              type="submit"
              className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-yellow px-4 h-10 rounded-md text-white cursor-pointer w-fit"
            >
              {label}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenSalePrice(false)
              }}
              className="flex justify-center items-center gap-2 capitalize text-sm font-medium px-4 h-10 rounded-md dark:text-white text-black cursor-pointer w-fit"
            >
              cancel
            </button>
          </div>
        
      </form>
    </div>
  );
};

export default SalePricePopUp;
