"use client";

import { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { SlPicture } from "react-icons/sl";
import { MdClose, MdErrorOutline } from "react-icons/md";
import SimpleInput from "@/components/simpleInput";
import AddItemInput from "@/components/AddItemInput";
import Select from "@/components/Select";
import VariationInput from "@/components/VariationInput";
import { getCategories } from "@/services/category";
import { editProduct, getProduct } from "@/services/products";
import { useParams, useRouter } from "next/navigation";

const removeImage = (file, files, setSelectedFiles) => {
  const array = files.filter((item) => {
    return item.name !== file.name;
  });

  setSelectedFiles(array);
};

const removeItem = (value, group, setGroup) => {
  const array = group.filter((item) => {
    return item !== value;
  });
  setGroup(array);
};

export default function NewProduct() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [salePrice, setSalePrice] = useState();
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [features, setFeatures] = useState([]);
  const [feature, setFeature] = useState("");
  const [stock, setStock] = useState();
  const [colors, setcolors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openCategorySelect, setOpenCategorySelect] = useState(false);
  const [openSizeSelect, setOpenSizeSelect] = useState(false);
  const [openColorSelect, setOpenColorSelect] = useState(false);
  const [variationColor, setVariationColor] = useState("");
  const [variationSize, setVariationSize] = useState("");
  const [variationStock, setVariationStock] = useState();
  const [done, setDone] = useState(false);
  const [images, setImages] = useState([]);
  const [onSale, setOnSale] = useState(false);

  const router = useRouter();

  const inputRef = useRef();

  const { slug } = useParams();

  const handleGetCategories = async () => {
    try {
      setIsLoading(true);
      const categories = await getCategories();
      let cat = [];
      if (categories) {
        categories.forEach((category) => {
          cat.push(category.name);
        });
      }
      setIsLoading(false);
      return cat;
    } catch (error) {
      setIsLoading(false);
      setError({ handlers: true, Error: error?.message });
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleGetProduct = async (slug) => {
    try {
      setIsLoading(true);
      const product = await getProduct({ slug });
      if (product) {
        setTitle(product?.title);
        setPrice(product?.price);
        product?.productInfo?.desc && setDesc(product.productInfo.desc);
        product?.productInfo?.features &&
          setFeatures(product.productInfo.features);
        product?.colors && setcolors(product.colors);
        product?.sizes && setSizes(product.sizes);
        product?.onSale && setOnSale(true);
        product?.salePrice && setSalePrice(product.salePrice);
        setStock(product.stock);
        product?.category && setCategory(product.category.name);
        product?.images && setImages(product.images);
        product?.variations && setVariations(product.variations);
      }
      setIsLoading(false);
    } catch (error) {
      setError({ handlers: true, Error: error?.message });
      setTimeout(() => setError(""), 3000);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return async () => {
      const result = await handleGetCategories();
      await handleGetProduct(slug);

      if (result) {
        setCategories(result);
      }
    };
  }, []);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn")) {
        setOpenCategorySelect(false);
        setOpenColorSelect(false);
        setOpenSizeSelect(false);
      }
    });
  }, []);

  const handleEditProduct = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0 && images === 0) {
      setError({
        upload: true,
        Error: "Product picture is required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!title) {
      setError({
        title: true,
        Error: "Title is required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!price) {
      setError({
        price: true,
        Error: "Price is required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!desc) {
      setError({
        desc: true,
        Error: "Description is required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!JSON.stringify(stock) || stock < 0) {
      setError({
        stock: true,
        Error: "Stock is required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    }

    // if (!category) {
    //   setError({
    //     category: true,
    //     Error: "Category is required",
    //   });
    //   setTimeout(() => setError(""), 3000);
    //   return;
    // }

    if (features.length === 0) {
      setError({
        features: true,
        Error: "features are required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (colors.length === 0) {
      setError({
        colors: true,
        Error: "Colors are required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (sizes.length === 0) {
      setError({
        sizes: true,
        Error: "Sizes are required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (
      variations.length === 0 &&
      (colors.length !== 1 || sizes.length !== 1)
    ) {
      setError({
        variations: true,
        Error: "Variations are required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    } else if (
      variations.length === 0 &&
      colors.length === 1 &&
      sizes.length === 1
    ) {
      setVariations({ color: colors[0], size: sizes[0], stock: stock });
    }

    const formData = new FormData();

    selectedFiles.map((file) => {
      formData.append("product", file);
    });

    // formData.append("title", title);
    // formData.append("desc", desc);
    // formData.append("price", price);
    // formData.append("category", category);
    // formData.append("colors", colors);
    // formData.append("sizes", sizes);
    // formData.append("features", features);
    // formData.append("variations", variations);

    formData.append(
      "document",
      JSON.stringify({
        title,
        productInfo: {
          desc,
          features,
        },
        stock,
        category,
        price,
        colors,
        sizes,
        variations,
        onSale,
        salePrice,
        images,
      })
    );

    try {
      setIsLoading(true);
      const response = await editProduct({ slug, formData });
      if (response) {
        setDone(true);
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 3000);
      }
      setTitle("");
      setPrice(null);
      setDesc("");
      setFeatures([]);
      setcolors([]);
      setSizes([]);
      setStock(null);
      setCategory("");
      setSelectedFiles([]);
      setVariations([]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError({ handlers: true, Error: error?.message });
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex justify-center w-full bg-white dark:bg-black text-black dark:text-white items-center pt-[60px] md:pl-[20%]">
          {"Loading..."}
        </div>
      ) : done ? (
        <div className="min-h-screen flex justify-center items-center  w-full bg-white dark:bg-black text-black dark:text-white pt-[60px] md:pl-[20%]">
          {"Product Edited Successfully"}
        </div>
      ) : (
        <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] text-black dark:text-white">
          <div className="grid grid-cols-4 w-full h-fit p-5">
            <form
              onSubmit={handleEditProduct}
              className="col-span-4 grid grid-cols-4 gap-4"
            >
              <div className="md:col-span-2 col-span-4 flex flex-col items-center gap-4">
                {error?.handlers && (
                  <div className="w-full">
                    <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                      <MdErrorOutline className="size-4" />
                      {error?.Error}
                    </div>
                  </div>
                )}
                <label htmlFor="file" className="sr-only">
                  Upload:
                </label>
                <input
                  ref={inputRef}
                  type="file"
                  name="file"
                  id="file"
                  multiple="multiple"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      if (e.target.files.length > 4) {
                        setError({
                          upload: true,
                          Error: "you cant' upload more than 4 pictures",
                        });

                        setTimeout(() => setError({}), 3000);
                        return;
                      }

                      const { files } = e.target;

                      let array = [];

                      for (let i = 0; i < files.length; i++) {
                        array.push(files[i]);
                      }
                      setSelectedFiles(array);
                    }
                  }}
                  className="sr-only"
                />

                {selectedFiles.length + images.length < 4 && (
                  <div className="flex flex-col items-start w-full">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedFiles.length === 4) {
                          return;
                        }
                        inputRef.current.click();
                      }}
                      className={`w-full h-28 bg-white dark:bg-darkBg rounded-md text-sm dark:text-gray text-[#404040] flex flex-col justify-center items-center gap-2 capitalize border border-dashed  ${
                        error?.upload
                          ? "border-red-400"
                          : "dark:border-[#8C8C8C] border-[#404040]"
                      }`}
                    >
                      <FiUpload />
                      upload
                      <p className="text-[8px] text-opacity-40 uppercase">
                        {`You can upload from 1 to ${
                          4 - images.length + selectedFiles.length
                        } pictures`}
                      </p>
                    </button>
                    {error?.upload && (
                      <p className="text-red-400 text-start text-[10px] mt-1">
                        {error?.Error}
                      </p>
                    )}
                  </div>
                )}

                {selectedFiles.length > 0 && (
                  <div className="w-full flex flex-col items-center gap-2">
                    {selectedFiles.map((file) => (
                      <div className="w-full bg-white dark:bg-darkBg flex items-center px-4 py-3 dark:text-gray text-[#404040] rounded-md border border-gray border-opacity-30 dark:border-opacity-5">
                        <SlPicture />
                        <p className="text-xs ml-2">{file.name}</p>
                        <button
                          type="button"
                          onClick={() => {
                            removeImage(file, selectedFiles, setSelectedFiles);
                          }}
                          className="flex justify-center items-center p-[2px] dark:bg-gray bg-[#404040] dark:text-darkBody text-bg rounded-full ml-auto text-sm"
                        >
                          <MdClose />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {images.length > 0 && (
                  <div className="w-full flex flex-col items-center gap-2">
                    {images.map((image) => (
                      <div className="w-full bg-white dark:bg-darkBg flex items-center px-4 py-3 dark:text-gray text-[#404040] rounded-md border border-gray border-opacity-30 dark:border-opacity-5">
                        <SlPicture />
                        <p className="text-xs ml-2">{image}</p>
                        <button
                          type="button"
                          onClick={() => {
                            removeItem(image, images, setImages);
                          }}
                          className="flex justify-center items-center p-[2px] dark:bg-gray bg-[#404040] dark:text-darkBody text-bg rounded-full ml-auto text-sm"
                        >
                          <MdClose />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col col-span-4 md:col-span-2">
                <SimpleInput
                  label={"title"}
                  type={"text"}
                  placeholder={"Title"}
                  value={title}
                  error={error}
                  handleChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  className={`w-full border ${
                    error?.title
                      ? "border-red-400"
                      : "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
                  }`}
                />
                {error?.title && (
                  <p className="text-red-400 text-[10px] mt-1 pl-1 capitalize col-span-2">
                    {error?.Error}
                  </p>
                )}
                <SimpleInput
                  label={"price"}
                  type={"number"}
                  placeholder={"Price"}
                  value={price}
                  error={error}
                  handleChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  className={`mt-4 w-full border ${
                    error?.price
                      ? "border-red-400"
                      : "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
                  }`}
                />
                <label
                  htmlFor="paymantMethod"
                  className="ml-4 mt-4 flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    name="paymantMethod"
                    id="paymantMethod"
                    value={"cash on delivery"}
                    checked={onSale}
                    onChange={() => setOnSale((prev) => !prev)}
                  />
                  On Sale
                </label>
                {onSale && (
                  <SimpleInput
                    label={"Sale Price"}
                    type={"number"}
                    placeholder={"Sale Price"}
                    value={salePrice}
                    error={error}
                    handleChange={(e) => {
                      setSalePrice(e.target.value);
                    }}
                    className={`mt-4 w-full border ${
                      error?.salePrice
                        ? "border-red-400"
                        : "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
                    }`}
                  />
                )}
                {error?.salePrice && (
                  <p className="text-red-400 text-[10px] mt-1 pl-1 capitalize col-span-2">
                    {error?.Error}
                  </p>
                )}
                <SimpleInput
                  label={"description"}
                  type={"text"}
                  placeholder={"Description"}
                  value={desc}
                  error={error}
                  handleChange={(e) => {
                    setDesc(e.target.value);
                  }}
                  className={`mt-4 w-full border ${
                    error?.desc
                      ? "border-red-400"
                      : "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
                  }`}
                />
                {error?.desc && (
                  <p className="text-red-400 text-[10px] mt-1 pl-1 capitalize col-span-2">
                    {error?.Error}
                  </p>
                )}

                <AddItemInput
                  label={"features"}
                  errorItem={"feature"}
                  value={feature}
                  setValue={setFeature}
                  group={features}
                  error={error}
                  setGroup={setFeatures}
                  placeholder={"Add Feature"}
                  setError={setError}
                  className={"w-full mt-4"}
                  ulClassName={"w-full mt-2"}
                  handleChange={(e) => {
                    setFeature(e.target.value);
                  }}
                  type={"text"}
                  inputClassName={`w-full border ${
                    error?.features
                      ? "border-red-400"
                      : "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
                  }`}
                />

                <Select
                  label={"Category"}
                  select={category}
                  setSelect={setCategory}
                  setOpenSelect={setOpenCategorySelect}
                  openSelect={openCategorySelect}
                  className={"w-full mt-2"}
                  options={categories}
                />

                <SimpleInput
                  label={"stock"}
                  type={"number"}
                  placeholder={"Stock"}
                  value={stock}
                  error={error}
                  handleChange={(e) => {
                    setStock(e.target.value);
                  }}
                  className={`mt-4 w-full border ${
                    error?.stock
                      ? "border-red-400"
                      : "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
                  }`}
                />
                {error?.stock && (
                  <p className="text-red-400 text-[10px] mt-1 pl-1 capitalize col-span-2">
                    {error?.Error}
                  </p>
                )}
                <AddItemInput
                  label={"colors"}
                  errorItem={"color"}
                  value={color}
                  setValue={setColor}
                  group={colors}
                  setGroup={setcolors}
                  placeholder={"Add Color"}
                  setError={setError}
                  error={error}
                  className={"w-full mt-4"}
                  ulClassName={"flex flex-wrap gap-x-5 pt-2 w-full"}
                  handleChange={(e) => {
                    setColor(e.target.value);
                  }}
                  type={"text"}
                  inputClassName={`w-full border ${
                    error?.colors
                      ? "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
                      : "border-red-400"
                  }`}
                />
                {/* {error?.colors && (
              <p className="text-red-400 text-[10px] mt-1 col-span-2">
                {error?.Error}
              </p>
            )} */}

                <AddItemInput
                  label={"sizes"}
                  error={error}
                  errorItem={"size"}
                  value={size}
                  setValue={setSize}
                  group={sizes}
                  setGroup={setSizes}
                  placeholder={"Add Size"}
                  setError={setError}
                  className={" w-full mt-2"}
                  ulClassName={"flex flex-wrap gap-x-5 py-2 w-full"}
                  handleChange={(e) => {
                    setSize(e.target.value);
                  }}
                  type={"text"}
                  inputClassName={`w-full border ${
                    error?.sizes
                      ? "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
                      : "border-red-400"
                  }`}
                />
                {/* {error?.sizes && (
              <p className="text-red-400 text-[10px] mt-1 col-span-2">
                {error?.Error}
              </p>
            )} */}
                <label className="text-sm mb-1 ml-[2px]">
                  Set the available product variations:
                </label>
                <VariationInput
                  className={""}
                  fullStock={stock}
                  colors={colors}
                  sizes={sizes}
                  setOpenColorSelect={setOpenColorSelect}
                  setOpenSizeSelect={setOpenSizeSelect}
                  openColorSelect={openColorSelect}
                  openSizeSelect={openSizeSelect}
                  color={variationColor}
                  size={variationSize}
                  setColor={setVariationColor}
                  setSize={setVariationSize}
                  stock={variationStock}
                  setStock={setVariationStock}
                  error={error}
                  setError={setError}
                  variations={variations}
                  setVariations={setVariations}
                />
                {error?.variations && (
                  <p className="text-red-400 text-[10px] mt-1 pl-1 capitalize col-span-2">
                    {error?.Error}
                  </p>
                )}
                {variations && (
                  <ul
                    className={`text-sm font-medium px-6 pt-2 list-disc capitalize`}
                  >
                    {variations.map((variation) => (
                      <li className="">
                        {variation.size}-{variation.color}×{variation.stock}
                        <button
                          className="inline ml-1"
                          type="button"
                          onClick={() =>
                            removeItem(variation, variations, setVariations)
                          }
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-yellow capitalize rounded-md disabled:cursor-not-allowed py-2 px-14 text-white font-lato my-7 font-medium self-center disabled:opacity-50"
                >
                  edit Product
                </button>
              </div>
            </form>
          </div>
        </main>
      )}
    </>
  );
}
