"use client";

import StatePopUp from "@/components/StatePopup";
import {
  deleteCountry,
  deleteState,
  getCountries,
  getCountry,
} from "@/services/countries";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdDeleteOutline,
  MdOutlineAdd,
  MdDelete ,
  MdModeEdit,
} from "react-icons/md";

export default function States() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState("");
  const [stateId, setStateId] = useState("");
  const [shippingFess, setShippingFees] = useState(0);
  const [openStatePopUp, setOpenStatePopUp] = useState(false);
  const [label, setLabel] = useState("");

  const router = useRouter();

  const { countryId } = useParams();

  const handleGetCountry = async (id) => {
    try {
      const data = await getCountry({ id });
      if (data) {
        setCountry(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleDeleteState = async (id) => {
    try {
      console.log(id);

      if (confirm("Are you sure you want to delete this state")) {
        setIsLoading(true);
        await deleteState({ id });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetCountry(countryId);
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && !openStatePopUp ? (
        <div className="min-h-screen w-full bg-white dark:bg-darkBg text-black dark:text-white flex justify-center items-center pt-[60px] md:pl-[20%]">
          {"Loading..."}
        </div>
      ) : (
        <main className="min-h-screen w-full flex flex-col gap-4 bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] pb-5 text-black dark:text-white">
          {openStatePopUp && (
            <StatePopUp
              label={label}
              state={state}
              setState={setState}
              countryId={countryId}
              shippingFees={shippingFess}
              setShippingFees={setShippingFees}
              setOpenStatePopUp={setOpenStatePopUp}
              setIsLoading={setIsLoading}
              setError={setError}
              error={error}
              stateId={stateId}
            />
          )}
          <div className="flex gap-4 pt-5 px-5 items-center justify-end">
            {error && <div>{error.message}</div>}
            <button
              type="button"
              onClick={() => {
                setStateId(state?._id);
                setState("");
                setShippingFees(0);
                setLabel("add State");
                setOpenStatePopUp(true);
              }}
              className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-yellow px-4 py-2 rounded-md text-white cursor-pointer"
            >
              <MdOutlineAdd className="size-4" />
              add new state
            </button>
          </div>

          <div className="px-5 pt-4 w-full">
            <h3 className="capitalize font-semibold my-5 text-2xl">
              {country?.country} states we provide shipping to:
            </h3>
            <table className="w-full text-start table">
              <thead className="w-full">
                <tr className="border-b-2 capitalize border-opacity-20 border-[#8C8C8C] dark:border-opacity-40">
                  <th className="font-medium text-start text-sm w-4 max-sm:hidden flex justify-center items-center text-[#8C8C8C] px-5 py-2">
                    #
                  </th>
                  <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 ">
                    state
                  </th>
                  <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 ">
                    Shipping Fees
                  </th>
                  <th className="font-medium text-start text-sm max-sm:hidden text-[#8C8C8C] py-2">
                    orders
                  </th>
                </tr>
              </thead>
              <tbody>
                {country?.states.length > 0 &&
                  country.states.map((state, index) => (
                    <tr
                      key={state?._id}
                      className="border-b-2 border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 h-fit"
                    >
                      <td className="text-sm py-4 font-semibold w-4 min-w-24 table-cell px-5 max-sm:hidden ">
                        {index + 1}
                      </td>

                      <td className="text-sm font-semibold capitalize min-w-16 px-5">
                        {state?.state}
                      </td>
                      <td className="text-sm font-semibold capitalize min-w-16">
                        {state?.shippingFees}
                      </td>
                      <td className="text-sm font-semibold min-w-16 max-sm:hidden">
                        <Link
                          href={`/dashboard/orders?state=${state?.state}`}
                          className="w-fit h-fit"
                        >
                          {state?.orders?.length}
                        </Link>
                      </td>

                      <td className="font-semibold table-cell md:w-[8%] max-sm:w-[4%] min-w-14">
                        <button
                          type="button"
                          onClick={() => {
                            setStateId(state?._id);
                            setState(state?.state);
                            setShippingFees(state?.shippingFees);
                            setLabel("edit state");
                            setOpenStatePopUp(true);
                          }}
                          className="px-1"
                        >
                          <MdModeEdit className="size-[18px] text-[#8C8C8C] dark:text-bg" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await handleDeleteState(state?._id);
                          }}
                          className="px-1"
                        >
                          <MdDelete  className="size-[18px] text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </main>
      )}
    </>
  );
}
