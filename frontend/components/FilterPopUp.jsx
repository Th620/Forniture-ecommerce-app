import { filter } from "@/constants";
import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const FilterPopUp = ({
  openSizeSelect,
  setOpenSizeSelect,
  openColorSelect,
  setOpenColorSelect,
  openSortSelect,
  setOpenSortSelect,
  size,
  setSize,
  sort,
  setSort,
  color,
  setColor,
  setOpenFilter,
}) => {
  return (
    <div className="w-full fixed z-40 bg-[#282828b1] top-0 left-0 min-h-screen flex items-center justify-center font-montserrat">
      <div className="w-3/4 rounded-sm bg-white flex flex-col justify-center px-8 py-6 gap-y-5">
        <div className="relative col-start-4 col-span-2">
          <button
            type="button"
            onClick={() => {
              setOpenSizeSelect((prev) => !prev);
              setOpenColorSelect(false);
              setOpenSortSelect(false);
            }}
            className="flex items-center gap-x-1 text-sm py-2 px-3 capitalize w-full hover:bg-bg font-medium"
          >
            {size && size !== "all" ? size : "Size"}
            <MdKeyboardArrowDown />
          </button>
          {openSizeSelect && (
            <ul className="absolute top-full z-30 min-w-28 bg-[#EEEFF1]">
              {filter.size.map((size) => (
                <li key={size}>
                  <button
                    type="button"
                    onClick={() => {
                      setSize(size);
                      setOpenSizeSelect(false);
                    }}
                    className="px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                  >
                    {size}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative col-start-6 col-span-2">
          <button
            type="button"
            onClick={() => {
              setOpenColorSelect((prev) => !prev);
              setOpenSizeSelect(false);
              setOpenSortSelect(false);
            }}
            className="flex items-center gap-x-1 text-sm py-2 px-3 capitalize w-full hover:bg-bg font-medium"
          >
            {color && color !== "all" ? color : "Color"}
            <MdKeyboardArrowDown />
          </button>
          {openColorSelect && (
            <ul className="absolute top-full z-30 min-w-28 bg-[#EEEFF1]">
              {filter.color.map((color) => (
                <li key={color}>
                  {" "}
                  <button
                    type="button"
                    onClick={() => {
                      setColor(color);
                      setOpenColorSelect(false);
                    }}
                    className="px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                  >
                    {color}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative col-start-10 col-span-3">
          <button
            type="button"
            onClick={() => {
              setOpenSortSelect((prev) => !prev);
              setOpenColorSelect(false);
              setOpenSizeSelect(false);
            }}
            className="flex items-center gap-x-1 text-sm py-2 px-3 capitalize w-full hover:bg-bg font-medium"
          >
            {sort && sort !== "no sort" ? sort : "Sort"}
            <MdKeyboardArrowDown />
          </button>
          {openSortSelect && (
            <ul className="absolute top-full z-30 min-w-28 bg-[#EEEFF1]">
              {filter.sort.map((sort) => (
                <li key={sort}>
                  <button
                    type="button"
                    onClick={() => {
                      setSort(sort);
                      setOpenSortSelect(false);
                    }}
                    className="px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                  >
                    {sort}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpenFilter(false)}
          className="py-2 px-8 rounded-sm self-center sm:self-end bg-navy hover:bg-navyHover font-lato text-white w-fit font-medium text-sm"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPopUp;
