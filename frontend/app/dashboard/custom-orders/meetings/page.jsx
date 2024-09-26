"use client";

import MessagePopUp from "@/components/MessagePopUp";
import Pagination from "@/components/Pagination";
import { deleteCategory } from "@/services/category";
import { getMeetings, getMessages } from "@/services/message";
import Link from "next/link";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegSquareCheck, FaSquareCheck } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { BsCalendarDateFill } from "react-icons/bs";
import DateFilter from "@/components/DateFilter";
import { MdOutlineErrorOutline } from "react-icons/md";
import Loading from "@/app/loading";

export default function Meetings() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meeting, setMeeting] = useState([]);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    +searchParams.get("page") || 1
  );
  const [totalPageCount, setTotalPageCount] = useState(0);

  const [openMessage, setOpenMessage] = useState(false);
  const [filter, setFilter] = useState(searchParams.get("d") || "");

  const [openfilter, setOpenFilter] = useState(false);

  const handleGetMeetings = async (page, d) => {
    try {
      const response = await getMeetings({ page, d });
      if (response.data) {
        setMeeting(response.data);
        if (JSON.parse(response.headers?.get("x-totalpagecount"))) {
          setTotalPageCount(
            JSON.parse(response.headers.get("x-totalpagecount"))
          );
        }else{
          setTotalPageCount(0)
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetMeetings(currentPage, filter);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading className={"dash-load max-md:p-0"} />
      ) : (
        <main className="min-h-screen w-full flex flex-col gap-4 bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] pb-5 text-black dark:text-white">
          {error ? (
            <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
              <MdOutlineErrorOutline className="md:text-lg text-3xl" />
              {error}
            </div>
          ) : (
            <div className="px-5 pt-4 w-full flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  setOpenFilter(true);
                }}
                className="flex justify-center items-center self-end gap-2 capitalize text-sm font-medium  transition-colors duration-150 bg-yellow px-5 py-2 rounded-md text-white border border-gray border-opacity-30 dark:border-opacity-5 cursor-pointer"
              >
                <BsCalendarDateFill />
                Date
              </button>
              <h3 className="capitalize font-semibold text-2xl mb-5 self-start">
                meetings
              </h3>

              <table className="w-full text-start table">
                <thead className="w-full capitalize">
                  <tr className="border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40">
                    <th className="font-medium text-start text-sm w-4 md:flex justify-center hidden items-center text-[#8C8C8C] px-5 py-2">
                      #
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 max-lg:hidden">
                      user
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 max-md:hidden ">
                      name
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 ">
                      date
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 ">
                      content
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!meeting ||
                    (meeting?.length === 0 && (
                      <tr>
                        <td colSpan={6} className="table-cell">
                          <div className="text-gray py-4 text-center">
                            No Messages
                          </div>
                        </td>
                      </tr>
                    ))}
                  {meeting?.length > 0 &&
                    meeting.map((message, index) => (
                      <tr
                        key={message?._id}
                        className="border-b-2 text-xs border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 h-[5vh] md:h-[6vh]"
                      >
                        <td className="font-semibold w-4 table-cell px-5 max-sm:hidden">
                          {index + 1 + (currentPage - 1) * 4}
                        </td>

                        <td className="font-semibold w-[15vw] max-lg:hidden">
                          <Link
                            href={
                              message?.user
                                ? `/dashboard/clients/${message.user}`
                                : ""
                            }
                          >
                            {message?.user ? message.user : "-"}
                          </Link>
                        </td>
                        <td className="font-medium min-w-16 capitalize max-md:hidden">
                          {message?.name}
                        </td>
                        <td className="font-medium min-w-16 capitalize">
                          {new Date(message?.meetingDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="font-medium min-w-16">
                          <p
                            onClick={() => {
                              setMessage(message);
                              setOpenMessage(true);
                            }}
                            className="overflow-ellipsis max-w-[25vw] line-clamp-1 cursor-pointer"
                          >
                            {message?.content}
                          </p>
                        </td>

                        <td className="font-medium table-cell w-[26vw] md:w-[8vw] text-white">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setMessage(message);
                                setOpenMessage(true);
                              }}
                              className="capitalize px-3 py-1.5 bg-navy rounded-full hover:bg-navyHover duration-200 transition-colors"
                            >
                              <span className="max-lg:hidden">show</span>{" "}
                              details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPageCount={totalPageCount}
                onPageChange={async (page) => {
                  setCurrentPage(page);
                  router.replace(
                    `/dashboard/custom-orders/meetings?${new URLSearchParams(
                      {
                        page,
                      }
                    )}`,
                    { scroll: true}
                  );
                  await handleGetMeetings(page, filter);
                }}
              />
            </div>
          )}
          {openMessage && (
            <MessagePopUp message={message} setOpenMessage={setOpenMessage} />
          )}
          {openfilter && (
            <DateFilter
              setFilter={setFilter}
              setOpenFilter={setOpenFilter}
              handler={async (filter) =>
                await handleGetMeetings(currentPage, filter)
              }
            />
          )}
        </main>
      )}
    </>
  );
}
