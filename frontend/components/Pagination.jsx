import { usePagination } from "@/hooks/usePagination";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Pagination = ({ currentPage, totalPageCount, onPageChange }) => {
  const paginationRange = usePagination({ currentPage, totalPageCount });

  if (paginationRange < 2) {
    return null;
  }

  console.log(paginationRange);

  let lastPage = paginationRange[paginationRange.length - 1];

  const next = () => {};

  const previous = () => {};

  return (
    <div className="flex font-medium items-center gap-2 my-8">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={async () => await onPageChange(currentPage - 1)}
        className="h-8 aspect-square rounded-md flex items-center justify-center text-xl disabled:opacity-50"
      >
        <MdKeyboardArrowLeft />
      </button>
      {paginationRange.map((page, index) => {
        if (page === "...") {
          return (
            <button key={page + index} type="button">
              &#8230;
            </button>
          );
        } else {
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-8 aspect-square rounded-md flex items-center justify-center ${
                currentPage == page
                  ? "bg-gray hover:bg-grayHover"
                  : "bg-transparent hover:bg-transparent"
              }`}
            >
              {page}
            </button>
          );
        }
      })}
      <button
        type="button"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-8 aspect-square rounded-md flex items-center justify-center text-lg disabled:opacity-50"
      >
        <MdKeyboardArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
