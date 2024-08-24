import React from "react";
import Select from "./Select";
import SimpleInput from "./simpleInput";
import { MdOutlineAdd } from "react-icons/md";

const calcStock = (variations, stock) => {
  let calcStock = 0;
  variations.forEach((element) => {
    calcStock += parseInt(element.stock);
  });

  calcStock += parseInt(stock);

  return calcStock;
};

const variationExist = (variations, color, size) => {
  for (let i = 0; i < variations.length; i++) {
    if (
      variations[i].color.toLowerCase() === color.toLowerCase() &&
      variations[i].size.toLowerCase() === size.toLowerCase()
    ) {
      return true;
    }
  }
};

const VariationInput = ({
  className,
  color,
  setColor,
  setOpenColorSelect,
  openColorSelect,
  colors,
  size,
  setSize,
  setOpenSizeSelect,
  openSizeSelect,
  sizes,
  stock,
  setStock,
  error,
  variations,
  setVariations,
  fullStock,
  setError,
}) => {
  return (
    <div
      className={`${className} w-full md:h-10 flex md:flex-row gap-y-2 flex-col h-fit items-center rounded-sm`}
    >
      <Select
        label={"Color"}
        select={color}
        setSelect={setColor}
        setOpenSelect={setOpenColorSelect}
        openSelect={openColorSelect}
        className={"lg:min-w-[25%] w-full border-none"}
        options={colors}
      />
      <Select
        label={"Size"}
        select={size}
        setSelect={setSize}
        setOpenSelect={setOpenSizeSelect}
        openSelect={openSizeSelect}
        className={"lg:min-w-[25%] w-full border-none"}
        options={sizes}
      />
      <div className="flex justify-stretch h-10 w-full md:min-w-[20%]">
        <SimpleInput
          label={"stock"}
          type={"number"}
          placeholder={"Stock"}
          value={stock}
          error={error}
          errorMessage={false}
          handelChange={(e) => {
            setStock(e.target.value);
          }}
          className={`md:mx-2 lg:min-w-[25%] w-full border ${
            error.variations
              ? "border-red-400"
              : "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
          }`}
        />
        <button
          type="button"
          onClick={(e) => {
            console.log(variationExist(variations, color, size));

            e.preventDefault();
            if (
              !variationExist(variations, color, size) &&
              fullStock &&
              color &&
              size &&
              stock &&
              calcStock(variations, stock) <= fullStock
            ) {
              setVariations([...variations, { color, size, stock }]);
              setColor("");
              setSize("");
              setStock("");
              return;
            }
            setColor("");
            setSize("");
            setStock("");
            if (variationExist(variations, color, size)) {
              setError({
                variations: true,
                Error: "Variation already exist",
              });
            } else if (calcStock(variations, stock) > fullStock) {
              setError({
                variations: true,
                Error: "That's override the avalaible stock",
              });
            } else {
              setError({
                variations: true,
                Error: "Not available variation",
              });
            }

            setTimeout(() => setError({}), 3000);
          }}
          className="bg-yellow h-10 aspect-square flex justify-center items-center rounded-sm text-white text-lg"
        >
          <MdOutlineAdd />
        </button>
      </div>
    </div>
  );
};

export default VariationInput;
