import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/services/products";
import { useSearchParams } from "next/navigation";

const ProductsContainer = ({ products, isLoading, noProducts }) => {
  // const [products, setProducts] = useState([]);

  // const searchParamsvalues = Object.fromEntries([...searchParams]);

  // const handelGetProducts = async ({
  //   color,
  //   size,
  //   sort,
  //   category,
  //   searchKeyword,
  // }) => {
  //   try {
  //     setIsLoading(true);
  //     const products = await getProducts({
  //       color,
  //       size,
  //       sort,
  //       category,
  //       searchKeyword,
  //     });

  //     setIsLoading(false);
  //     return products;
  //   } catch (error) {
  //     setIsLoading(false);
  //     setError(error);
  //     setTimeout(() => setError(""), 3000);
  //   }
  // };

  // useEffect(() => {
  //   return async () => {
  //     try {
  //       const fetchProducts = await handelGetProducts(searchParamsvalues);

  //       if (fetchProducts) {
  //         if (fetchProducts.length === 0) {
  //           setNoProducts(true);
  //         }
  //         setProducts([...fetchProducts]);
  //       } else {
  //         setNoProducts(true);
  //       }
  //     } catch (error) {
  //       setError(error.message);
  //       console.log(error);
  //     }
  //   };
  // }, [searchParams]);

  return (
    <div className="grid grid-cols-12 col-span-12 md:col-span-9 gap-4 py-1">
      {isLoading || noProducts ? (
        <div className="col-span-12 w-full h-14">
          {isLoading ? "Loading" : "No Product"}
        </div>
      ) : (
        <>
          {products.map((product) => (
            <ProductCard
              product={product}
              key={product._id}
              className={"col-span-12 sm:col-span-6 md:col-span-3"}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ProductsContainer;
