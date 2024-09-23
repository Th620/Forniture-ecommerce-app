"use client";

import Loading from "@/app/loading";
import Pagination from "@/components/Pagination";
import { deleteCategory } from "@/services/category";
import {
  checkReview,
  deleteReview,
  getProductReviews,
} from "@/services/review";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegSquareCheck, FaSquareCheck } from "react-icons/fa6";
import { MdDelete, MdOutlineErrorOutline } from "react-icons/md";

export default function Reviews() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { slug } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productTitle, setProductTitle] = useState("");
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    +searchParams.get("page") || 1
  );
  const [totalPageCount, setTotalPageCount] = useState(0);

  const handleGetReviews = async (page) => {
    try {
      const response = await getProductReviews({
        slug,
        page,
      });
      if (response.data) {
        setProductTitle(response.data?.product);
        setReviews(response.data?.reviews);
        if (JSON.parse(response?.headers?.get("x-totalpagecount"))) {
          setTotalPageCount(
            JSON.parse(response?.headers?.get("x-totalpagecount"))
          );
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);

      setError({ reviews: true, Error: error.message });
    }
  };

  const handleCheckReview = async (id) => {
    try {
      await checkReview({ id });
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await deleteReview({ id });
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    return async () => {
      await handleGetReviews(currentPage);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading className={"dash-load max-md:p-0"} />
      ) : (
        <main className="min-h-screen w-full flex flex-col gap-4 bg-bg dark:bg-darkBody font-montserrat pt-[60px] md:pl-[20%] pb-5 text-black dark:text-white">
          {error?.reviews ? (
            <div className="right-0 absolute md:left-[20%] left-0 bottom-0 top-0 text-[#8C8C8C] flex max-md:flex-col gap-y-4 justify-center items-center gap-x-2 p-5 md:p-10">
              <MdOutlineErrorOutline className="md:text-lg text-3xl" />
              {error.Error}
            </div>
          ) : (
            <div className="px-5 pt-4 w-full flex flex-col items-center">
              <div>
                <h3 className="capitalize font-semibold my-5 text-2xl self-start">
                  {`${productTitle}'s  reviews`}
                </h3>
                {true && !error?.reviews && (
                  <div className="ml-auto w-1/3">
                    <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                      <MdErrorOutline className="size-4" />
                      {error}
                    </div>
                  </div>
                )}
              </div>
              <table className="w-full text-start table">
                <thead className="w-full capitalize">
                  <tr className="border-b-2  border-opacity-20 border-[#8C8C8C] dark:border-opacity-40">
                    <th className="font-medium text-start text-sm w-4 md:flex justify-center hidden items-center text-[#8C8C8C] px-5 py-2">
                      #
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 ">
                      user
                    </th>
                    <th className="font-medium text-start text-sm text-[#8C8C8C] py-2 ">
                      content
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!reviews ||
                    (reviews?.length === 0 && (
                      <tr>
                        <td colSpan={6} className="table-cell">
                          <div className="text-gray py-4 text-center">
                            No Reviews
                          </div>
                        </td>
                      </tr>
                    ))}
                  {reviews?.length > 0 &&
                    reviews.map((review, index) => (
                      <tr
                        key={review?._id}
                        className="border-b-2 border-opacity-20 border-[#8C8C8C] dark:border-opacity-40 h-[5vh] md:h-[8vh]"
                      >
                        <td className="text-sm font-semibold w-4 min-w-24 table-cell px-5 max-sm:hidden">
                          {index + 1 + (currentPage - 1) * 4}
                        </td>

                        <td className="text-sm font-semibold">
                          {`${review?.user?.firstName} ${review?.user?.lastName}`}
                        </td>
                        <td className="text-sm font-semibold min-w-16">
                          {review?.content}
                        </td>

                        <td className="font-semibold table-cell md:w-[4%] min-w-14">
                          <button
                            type="button"
                            onClick={async () => {
                              await handleCheckReview(review?._id);
                              await handleGetReviews(currentPage);
                            }}
                            className="px-1"
                          >
                            <abbr
                              title={
                                review?.check
                                  ? "Uncheck Review"
                                  : "Check Review"
                              }
                            >
                              {review?.check ? (
                                <FaSquareCheck className="size-[18px] text-[#8C8C8C] dark:text-bg" />
                              ) : (
                                <FaRegSquareCheck className="size-[18px] text-[#8C8C8C] dark:text-bg" />
                              )}
                            </abbr>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await handleDeleteReview(review?._id);
                              await handleGetReviews(currentPage);
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
              <Pagination
                currentPage={currentPage}
                totalPageCount={totalPageCount}
                onPageChange={async (page) => {
                  setCurrentPage(page);
                  router.replace(
                    `http://localhost:3000/dashboard/products/${slug}/reviews?${new URLSearchParams(
                      {
                        page,
                      }
                    )}`
                  );
                  await handleGetReviews(page);
                }}
              />
            </div>
          )}
        </main>
      )}
    </>
  );
}
