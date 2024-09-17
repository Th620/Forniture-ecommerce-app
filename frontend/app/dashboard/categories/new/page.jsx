"use client";

import { useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { SlPicture } from "react-icons/sl";
import { MdClose, MdErrorOutline } from "react-icons/md";
import SimpleInput from "@/components/simpleInput";
import { useRouter } from "next/navigation";
import { addCategory } from "@/services/category";

export default function NewCategory() {
  const [error, setError] = useState({});
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState("");

  const router = useRouter();

  const inputRef = useRef();

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError({
        upload: true,
        Error: "Category picture is required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!name) {
      setError({
        name: true,
        Error: "Category nale is required",
      });
      setTimeout(() => setError(""), 3000);
      return;
    }

    const formData = new FormData();

    formData.append("category", selectedFile);

    formData.append("name", name);

    try {
      setIsLoading(true);
      const response = await addCategory(formData);
      if (response) {
        console.log(response);
        setDone(true);
        setTimeout(() => {
          router.back();
        }, 3000);
      }
      setName("");
      setSelectedFile(null);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError({ handlers: true, Error: error.message });
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
        <div className="min-h-screen flex justify-center items-center  w-full bg-white dark:bg-black text-black dark:text-white md:pl-[20%]">
          {"Category Created Successfully"}
        </div>
      ) : (
        <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] text-black dark:text-white">
          <div className="grid grid-cols-4 w-full h-fit p-5">
            <form
              onSubmit={handleAddCategory}
              className="col-span-4 grid grid-cols-4 gap-4"
            >
              <div className="md:col-span-2 col-span-4 flex flex-col items-center gap-4">
                <label htmlFor="file" className="sr-only">
                  Upload:
                </label>
                <input
                  ref={inputRef}
                  type="file"
                  name="file"
                  id="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="sr-only"
                />
                {!selectedFile && (
                  <div className="flex flex-col items-start w-full">
                    <button
                      type="button"
                      onClick={() => {
                        inputRef.current.click();
                      }}
                      className={`w-full h-28 bg-white dark:bg-darkBg rounded-md text-sm dark:text-gray text-[#404040] flex flex-col justify-center items-center gap-2 capitalize border border-dashed  ${
                        error.upload
                          ? "border-red-400"
                          : "dark:border-[#8C8C8C] border-[#404040]"
                      }`}
                    >
                      <FiUpload />
                      upload
                      <p className="text-[8px] text-opacity-40 uppercase">
                        You can upload from 1 picture
                      </p>
                    </button>
                    {error.upload && (
                      <p className="text-red-400 text-start text-[10px] mt-1">
                        {error.Error}
                      </p>
                    )}
                  </div>
                )}
                {selectedFile && (
                  <div className="w-full flex flex-col items-center gap-2">
                    <div className="w-full bg-white dark:bg-darkBg flex items-center px-4 py-3 dark:text-gray text-[#404040] rounded-md border border-gray border-opacity-30 dark:border-opacity-5">
                      <SlPicture />
                      <p className="text-xs ml-2">{selectedFile.name}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                        }}
                        className="flex justify-center items-center p-[2px] dark:bg-gray bg-[#404040] dark:text-darkBody text-bg rounded-full ml-auto text-sm"
                      >
                        <MdClose />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col col-span-4 md:col-span-2">
                <SimpleInput
                  label={"name"}
                  type={"text"}
                  placeholder={"Name"}
                  value={name}
                  error={error}
                  handleChange={(e) => {
                    setName(e.target.value);
                  }}
                  className={`w-full border ${
                    error.name
                      ? "border-red-400"
                      : "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
                  }`}
                />
                {error.name && (
                  <p className="text-red-400 text-[10px] mt-1 pl-1 capitalize col-span-2">
                    {error.Error}
                  </p>
                )}{" "}
                {error.handlers && (
                  <div className="w-full mt-4">
                    <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                      <MdErrorOutline className="size-4" />
                      {error.Error}
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  onkeyDown={(e) => e.preventDefault()}
                  disabled={isLoading}
                  className="bg-yellow rounded-md disabled:cursor-not-allowed py-2 px-14 text-white font-lato my-7 font-medium self-center disabled:opacity-50"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </main>
      )}
    </>
  );
}
