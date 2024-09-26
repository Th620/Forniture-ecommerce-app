"use client";

import Loading from "@/app/loading";
import { filter } from "@/constants";
import { getUser } from "@/services/user";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { MdOutlineErrorOutline } from "react-icons/md";

export default function User() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { id } = useParams();

  const handleGetUser = async ({ id }) => {
    try {
      setIsLoading(true);
      const data = await getUser({ id });
      if (data) {
        setUser(data);
        console.log(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // to check
      const err = JSON.parse(error.message);
      if (err.status === 401) {
        setError("Unauthorized");
        setTimeout(() => {
          router.push("/account/sign-in", { scroll: true});
        }, 2000);
      } else {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetUser({ id });
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading className={"dash-load max-md:p-0"} />
      ) : (
        <main className="min-h-screen w-full bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] text-black dark:text-white pb-10">
          {error ? (
            <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] inline-flex justify-center items-center gap-x-2 p-5 md:p-10">
              <MdOutlineErrorOutline className="text-lg" />
              {error}
            </div>
          ) : (
            <div className="flex justify-center items-center gap-4 flex-col">
              <div className=" grid grid-cols-4 w-full gap-4 p-5">
                {error && (
                  <div className="col-span-4">
                    <div className="max-md:w-full error bg-red-200 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                      <MdErrorOutline className="size-4" />
                      {error}
                    </div>
                  </div>
                )}

                <div className="md:col-span-2 col-span-4 flex flex-col gap-2">
                  <p className="text-sm">First Name:</p>
                  <div className="h-10 bg-input dark:bg-darkBg capitalize flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
                    {user?.firstName}
                  </div>
                </div>

                <div className="md:col-span-2 col-span-4 flex flex-col gap-2">
                  <p className="text-sm">Last Name:</p>
                  <div className="h-10 bg-input dark:bg-darkBg capitalize flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
                    {user?.lastName}
                  </div>
                </div>

                <div className="md:col-span-2 col-span-4 flex flex-col gap-2">
                  <p className="text-sm">Phone:</p>
                  <div className="h-10 bg-input dark:bg-darkBg flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
                    {user?.phone ? user.phone : "no phone number"}
                  </div>
                </div>
                <div className="md:col-span-2 col-span-4 flex flex-col gap-2">
                  <p className="text-sm">Email:</p>
                  <div className="h-10 bg-input dark:bg-darkBg flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
                    {user?.email}
                  </div>
                </div>

                <div className="md:col-span-2 col-span-4 flex flex-col gap-2">
                  <p className="text-sm">Country:</p>
                  <div className="h-10 bg-input dark:bg-darkBg capitalize flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
                    {user?.country ? user.country?.country : "-"}
                  </div>
                </div>
                <div className="md:col-span-2 col-span-4 flex flex-col gap-2">
                  <p className="text-sm">State:</p>
                  <div className="h-10 bg-input dark:bg-darkBg capitalize flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
                    {user?.state ? user.state?.state : "-"}
                  </div>
                </div>

                <div className="md:col-span-2 col-span-4 flex flex-col gap-2">
                  <p className="text-sm">City:</p>
                  <div className="h-10 bg-input dark:bg-darkBg capitalize flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
                    {user?.city ? user.city : "-"}
                  </div>
                </div>

                <div className="md:col-span-2 col-span-4 flex flex-col gap-2">
                  <p className="text-sm">Full Address:</p>
                  <div className="h-10 bg-input dark:bg-darkBg capitalize flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
                    {user?.address ? user.address : "-"}
                  </div>
                </div>

                <div className="md:col-span-2 col-span-4 flex flex-col gap-2">
                  <p className="text-sm">Registred:</p>
                  <div className="h-10 bg-input dark:bg-darkBg flex items-center dark:text-gray text-black text-opacity-50 dark:text-opacity-100 outline-none col-span-4 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm">
                    {new Date(user?.createdAt).toLocaleDateString("es-CL", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-start w-full px-5">
                <button
                  type="submit"
                  onClick={() => {
                    router.push(`/dashboard/orders?u=${user?._id}`, { scroll: true});
                  }}
                  className="capitalize w-full md:w-1/3 lg:w-1/4 xl:w-1/5 pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white"
                >
                  Orders
                </button>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
}
