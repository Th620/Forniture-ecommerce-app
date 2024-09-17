import { useMemo } from "react";

const DOTS = "...";

export const usePagination = ({ currentPage, totalPageCount }) => {
  const paginationRange = useMemo(() => {
    console.log(totalPageCount);

    // 1- totalPageCount <= 7
    if (totalPageCount <= 7) {
      return range(1, totalPageCount);
    }

    // 2- totalPageCount > 7 and currentPage E [1, 5]
    if (totalPageCount > 7 && currentPage >= 1 && currentPage <= 5) {
      return [...range(1, 5), DOTS, totalPageCount];
    }

    // 3- totalPageCount > 7 and currentPage E [totalPageCount - 4, totalPageCount]
    if (
      totalPageCount > 7 &&
      currentPage >= totalPageCount - 4 &&
      currentPage <= totalPageCount
    ) {
      return [1, DOTS, ...range(totalPageCount - 4, totalPageCount)];
    }

    // 4- totalPageCount > 7 and currentPage E [6, totalPageCount - 5]
    if (
      totalPageCount > 7 &&
      currentPage >= 6 &&
      currentPage <= totalPageCount - 5
    ) {
      return [
        1,
        DOTS,
        ...range(currentPage - 1, ++currentPage),
        DOTS,
        totalPageCount,
      ];
    }
  }, [currentPage, totalPageCount, range]);
  return paginationRange;
};

const range = (start, end) => {
  const length = end - start + 1;
  return Array.from({ length }, (item, index) => index + start);
};
