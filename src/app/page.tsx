"use client";

import toast from "react-hot-toast";
import Link from "next/link";
// import { SkeletonLoader } from "../components/Loaders/SkeletonLoader";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import { useEffect } from "react";
import Loader from "@/components/Loaders/Loader";

const Home = () => {
  const { data, isLoading, isError, error } = useLatestProductsQuery("");

  useEffect(() => {
    if (isError || error) {
      const err = error as CustomError;
      err.data?.message
        ? toast.error(err.data.message)
        : toast.error("Failed to fetch products");
    }
  }, [isError, error]);

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link href="/search" className="findMore">
          More
        </Link>
      </h1>
      <main>
        {isLoading ? (
          <Loader />
          //   <SkeletonLoader
          //     flexDir="row"
          //     height="25rem"
          //     width="18.75rem"
          //     length={6}
          //   />
        ) : (
          data &&
          data.products.map((product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              photos={product.photos}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
