"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SkeletonLoader } from "@/components/Loaders/SkeletonLoader";
import ProductCard from "@/components/ProductCard";
import { useSearchProductsQuery } from "@/redux/api/productAPI";
import { CustomError } from "@/types/api-types";
import Loader from "@/components/Loaders/Loader";
import { useRouter } from "next/navigation";

import { FaFilter, FaSortAmountDown } from "react-icons/fa";

const Search = () => {
    const router = useRouter();
    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<string>("");
    const [currentPrice, setCurrentPrice] = useState<number>(100000);
    const [category, setCategory] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    // ... (rest of the hooks)

    const {
        data: searchProductsResponse,
        isLoading: loadingSearchProducts,
        isError: isErrorSearchProducts,
        error: errorSearchProducts,
    } = useSearchProductsQuery({
        search,
        sort,
        category,
        page,
        price: currentPrice,
    });

    const totalPage = searchProductsResponse?.totalPage || 1;
    const categoriesResponse = searchProductsResponse?.categories || [];
    const products = searchProductsResponse?.products || [];
    const minAmount = searchProductsResponse?.minAmount || 0;
    const maxAmount = searchProductsResponse?.maxAmount || 100000;

    const isPrevPage = page > 1;
    const isNextPage = page < totalPage;

    useEffect(() => {
        if (isErrorSearchProducts || errorSearchProducts) {
            const err = errorSearchProducts as CustomError;
            err.data?.message
                ? toast.error(err.data.message)
                : toast.error("Failed to fetch filtered products");
        }
    }, [isErrorSearchProducts, errorSearchProducts]);

    if (isErrorSearchProducts || errorSearchProducts) {
        return <div className="red">Error loading products</div>;
    }

    const clearHandler = () => {
        setLoading(true);
        setSearch("");
        setSort("");
        setCurrentPrice(100000);
        setCategory("");
        setPage(1);
        setLoading(false);
    };

    if (loading) return <Loader />;

    return (
        <div className="productSearchPage">
            <button
                className="mobile-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
            >
                {showFilters ? "Hide Filters" : "Filters"} <FaFilter />
            </button>
            <aside className={showFilters ? "show" : ""}>
                <div className="filter-header">
                    <h2>Filters</h2>
                    <button className="close-filters" onClick={() => setShowFilters(false)}>×</button>
                </div>
                <div>
                    <h4>Sort</h4>
                    <select
                        suppressHydrationWarning
                        title="sort"
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setCurrentPrice(100000);
                        }}
                    >
                        <option value="">None</option>
                        <option value="asc">Price (Low to High)</option>
                        <option value="dsc">Price (High to Low)</option>
                    </select>
                </div>

                <div>
                    <h4>Max Price: {currentPrice || ""}</h4>
                    <input
                        suppressHydrationWarning
                        title="range"
                        type="range"
                        min={0}
                        max={100000}
                        value={currentPrice}
                        onChange={(e) => {
                            setCurrentPrice(Number(e.target.value));
                        }}
                    />
                </div>

                <div>
                    <h4>Category</h4>
                    <select
                        suppressHydrationWarning
                        title="category"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setCurrentPrice(100000);
                        }}
                    >
                        <option value="">ALL</option>
                        {!loadingSearchProducts &&
                            categoriesResponse?.map((category) => (
                                <option key={category} value={category}>
                                    {category.toUpperCase()}
                                </option>
                            ))}
                    </select>
                </div>
                <div>
                    <button suppressHydrationWarning onClick={clearHandler}>Clear</button>
                </div>
            </aside>
            <main>
                <h1>Products</h1>
                <input
                    suppressHydrationWarning
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="searchProductList">
                    {loadingSearchProducts ? (
                        <SkeletonLoader
                            flexDir="row"
                            height="25rem"
                            width="18.75rem"
                            length={5}
                        />
                    ) : (
                        products.map((product) => (
                            <ProductCard
                                key={product._id}
                                productId={product._id}
                                photos={product.photos}
                                name={product.name}
                                price={product.price}
                                stock={product.stock}
                            />
                        ))
                    )}
                </div>

                {totalPage > 1 && (
                    <article>
                        <button
                            disabled={!isPrevPage}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Prev
                        </button>
                        <span>
                            {page} of {totalPage}
                        </span>
                        <button
                            disabled={!isNextPage}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Next
                        </button>
                    </article>
                )}
            </main>
        </div>
    );
};

export default Search;
