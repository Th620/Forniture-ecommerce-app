import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const Select = ({
  btnClassName,
  className,
  setOpenSelect,
  openSelect,
  select,
  options,
  setSelect,
  label,
  onClick = (option) => {
    setSelect(option);
    setOpenSelect(false);
  },
  addFn = () => {},
}) => {
  return (
    <div className={`${className} relative`}>
      <button
        type="button"
        onClick={() => {
          setOpenSelect((prev) => !prev);
          addFn()
        }}
        className={`${btnClassName} overflow-ellipsis text-nowrap overflow-hidden flex justify-between h-10 btn items-center px-4 bg-white dark:bg-darkBg text-sm py-1 capitalize font-medium w-full`}
      >
        <p className="overflow-ellipsis">{select ? select : label}</p>
        {openSelect ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
      </button>
      {openSelect && (
        <ul className="absolute top-full z-50 min-w-28 bg-[#EEEFF1] dark:bg-darkBody w-full ul">
          {options.map((option) => {
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => onClick(option)}
                  className="px-2 py-1 btn hover:bg-[#E2E3E5] dark:hover:bg-darkBg transition-colors duration-100 text-left capitalize text-[12px] w-full"
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;
