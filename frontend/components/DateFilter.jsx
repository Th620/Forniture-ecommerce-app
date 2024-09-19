import { useRef } from "react";

const DateFilter = ({ setOpenFilter, setFilter, handler = async () => {} }) => {
  const inputRef = useRef();

  return (
    <div
      className={`fixed z-20 bg-[#282828b1] top-0 left-0 flex items-center justify-center font-montserrat w-full h-screen pt-[60px] md:pl-[20%]`}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setFilter(inputRef.current.value);
          await handler(inputRef.current.value);
          setOpenFilter(false);
        }}
        className={`dark:bg-darkBg  w-3/4 md:w-1/3 rounded-sm bg-white flex flex-col justify-center px-8 py-6`}
      >
        <label htmlFor={"date"} className="mb-2">
          Date:
        </label>
        <input
          type={"date"}
          name={"date"}
          id={"date"}
          ref={inputRef}
          className={`mt-2 h-10 bg-bg dark:bg-darkBody outline-none text-sm font-medium placeholder:text-gray  placeholder:dark:text-opacity-40 placeholder:text-sm px-4 rounded-sm
        }`}
        />
        <div className="flex items-center justify-start gap-4 my-4">
          <button
            type="submit"
            className="px-4 py-1.5 capitalize rounded-full bg-yellow text-white"
          >
            Filter
          </button>

          <button
            type="button"
            onClick={() => {
              setOpenFilter(false);
            }}
            className="flex justify-center items-center gap-2 capitalize text-sm font-medium px-2 h-10 rounded-md dark:text-white text-black cursor-pointer w-fit"
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DateFilter;
