"use client";

import Loading from "@/app/loading";
import CountryPopUp from "@/components/CountryPopUp";
import { deleteCountry, getCountries } from "@/services/countries";
import { cancelOrder, getOrders } from "@/services/order";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MdOutlineAdd,
  MdDelete,
  MdModeEdit,
  MdOutlineErrorOutline,
  MdErrorOutline,
} from "react-icons/md";

export default function Shipping() {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [country, setCountry] = useState("");
  const [countryId, setCountryId] = useState("");
  const [openCountryPopUp, setOpenCountryPopUp] = useState(false);
  const [label, setLabel] = useState("");

  const handleGetCountries = async () => {
    try {
      const data = await getCountries();
      if (data) {
        setCountries(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ shipping: true, Error: error.message });
    }
  };

  const handleDeleteCountries = async (id) => {
    try {
      if (confirm("Are you sure you want to delete this country?")) {
        setIsLoading(true);
        await deleteCountry({ id });
        
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetCountries();
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && !openCountryPopUp ? (
        <Loading className={"dash-load max-md:p-0"} />
      ) : (
        <main className="min-h-screen w-full flex flex-col gap-4 bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] pb-5 text-black dark:text-white">
          {openCountryPopUp && (
            <CountryPopUp
              label={label}
              country={country}
              setCountry={setCountry}
              countryId={countryId}
              setOpenCountryPopUp={setOpenCountryPopUp}
              setIsLoading={setIsLoading}
              setError={setError}
              error={error}
            />
          )}
          {error?.shipping ? (
            <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
              <MdOutlineErrorOutline className="md:text-lg text-3xl" />
              {error.Error}
            </div>
          ) : (
            <>
              <div className="flex gap-4 pt-5 px-5 items-center justify-end">
                {error && !error?.shipping && (
                  <div className="mr-auto w-1/3">
                    <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                      <MdErrorOutline className="size-4" />
                      {error}
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCountry("");
                    setLabel("add country");
                    setOpenCountryPopUp(true);
                  }}
                  className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-yellow px-4 py-2 rounded-md text-white cursor-pointer"
                >
                  <MdOutlineAdd className="size-4" />
                  add new country
                </button>
              </div>
              <div className="px-5 pt-4 w-full">
                <h3 className="capitalize font-semibold my-5 text-2xl">
                  countries we provide shipping to:
                </h3>

                <table className="w-full text-start table">
                  <thead className="w-full">
                    <tr className="border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 capitalize">
                      <th className="font-medium text-start text-sm w-4 hidden md:flex justify-center items-center text-[#8C8C8C] px-5 py-2">
                        #
                      </th>
                      <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 ">
                        country
                      </th>
                      <th className="font-medium text-start text-sm max-sm:hidden text-[#8C8C8C] py-2 ">
                        states we provide shipping to:
                      </th>
                      <th className="font-medium text-start text-sm text-[#8C8C8C] py-2">
                        orders
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.length > 0 &&
                      countries.map((country, index) => (
                        <tr
                          key={country?._id}
                          className="border-b-2 border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 h-fit max-sm:h-[5vh]"
                        >
                          <td className="text-sm py-4 font-semibold w-4 min-w-24 table-cell px-5 max-sm:hidden ">
                            {index + 1}
                          </td>

                          <td className="text-sm font-semibold capitalize min-w-16 max-sm:w-[40vw]">
                            <Link
                              href={`/dashboard/shipping/${country?._id}`}
                              className="w-fit h-fit"
                            >
                              {country?.country}
                            </Link>
                          </td>
                          <td className="text-sm font-semibold capitalize min-w-16 max-sm:hidden">
                            <Link
                              href={`/dashboard/shipping/${country?._id}`}
                              className="w-fit h-fit"
                            >
                              {country?.states?.length}
                            </Link>
                          </td>
                          <td className="text-sm font-semibold min-w-16">
                            <Link
                              href={`/dashboard/orders?country=${country?._id}`}
                              className="w-fit h-fit"
                            >
                              {country?.orders?.length}
                            </Link>
                          </td>

                          <td className="font-semibold table-cell md:w-[8%] max-sm:w-[4%] min-w-14">
                            <button
                              type="button"
                              onClick={() => {
                                setCountry(country?.country);
                                setLabel("edit country");
                                setCountryId(country?._id);
                                setOpenCountryPopUp(true);
                              }}
                              className="px-1"
                            >
                              <MdModeEdit className="size-[18px] text-[#8C8C8C] dark:text-bg" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await handleDeleteCountries(country?._id);
                              }}
                              className="px-1"
                            >
                              <MdDelete className="size-[18px] text-red-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      )}
    </>
  );
}
