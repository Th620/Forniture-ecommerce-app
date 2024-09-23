"use client";

import { BASE_URL } from "@/constants";
import { getProducts } from "@/services/products";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";

const SearchClient = ({ setOpenSearch }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const searchRef = useRef();

  const router = useRouter();

  const handleGetProducts = async ({
    color,
    size,
    sort,
    category,
    searchKeyword,
    page,
  }) => {
    try {
      const { data, headers } = await getProducts({
        color,
        size,
        sort,
        category,
        searchKeyword,
        pageSize: 4,
        page,
      });

      if (data) {
        if (JSON.parse(headers?.get("X-Totalcount"))) {
          setTotalCount(JSON.parse(headers.get("X-Totalcount")));
        }
        setProducts([...data]);
      }
    } catch (error) {}
  };

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.classList.contains("search")) {
        setOpenSearch(false);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      searchRef.current?.focus();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#282828] bg-opacity-75 z-[200000] flex flex-col justify-center items-center">
      <div className="lg:w-1/3">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (search) {
              setOpenSearch(false);
              router.push(`/products?s=${search}`);
            }
            setOpenSearch(false);
          }}
          className="flex items-center justify-stretch border-b-2 border-gray py-2 w-full"
        >
          <input
            type="search"
            name="search"
            id="search"
            ref={searchRef}
            value={search}
            onChange={async (e) => {
              setSearch(e.target.value);
              if (e.target.value.length > 2) {
                await handleGetProducts({ searchKeyword: e.target.value });
              } else {
                setProducts([]);
              }
            }}
            placeholder="Search..."
            className="search bg-transparent placeholder:text-gray placeholder:text-opacity-90 text-2xl w-full outline-none pr-5 text-gray"
          />
          <button type="submit">
            <IoIosSearch className="search text-3xl text-gray text-opacity-90" />
          </button>
        </form>
        <div className="w-full search">
          {(!products || products?.length === 0) && search.length > 2 && (
            <div className="search w-full text-center text-white py-3">
              No products
            </div>
          )}
          {products?.map((product) => (
            <Link
              className="w-full"
              onClick={() => setOpenSearch(false)}
              href={`/products/${product?.slug}`}
            >
              <div className="flex items-stretch py-2 search">
                <div className="relative aspect-[1/1.2] w-[4vw] bg-bg mr-2 search">
                  <Image
                    src={
                      product?.images[0]
                        ? BASE_URL + product.images[0]
                        : "/lamp.png"
                    }
                    layout="fill"
                    objectFit="cover"
                    alt={product?.title}
                  />
                </div>

                <div className="h-full self-center search">
                  <h3 className="text-wrap text-lg text-white hover:text-opacity-100 capitalize search">
                    {`${product?.title}`}
                  </h3>
                </div>
                <p className="text-sm text-white  ml-auto self-center search">
                  {product?.price} DZD
                </p>
              </div>
            </Link>
          ))}
          {products && products.length > 0 && totalCount > 4 && (
            <button
              type="button"
              onClick={() => {
                setOpenSearch(false);
                router.push(`/products?s=${search}`);
              }}
              className="capitalize search text-gray underline py-2"
            >
              show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchClient;
