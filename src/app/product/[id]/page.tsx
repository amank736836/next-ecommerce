"use client";

import { CarouselButtonType, MyntraCarousel, Slider } from "6pp";
import { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ProductLoader from "@/components/Loaders/ProductLoader";
import Ratings from "@/components/Review/Ratings";
import ReviewCard from "@/components/Review/ReviewCard";
import { ReviewCustomizedButtons } from "@/components/Review/ReviewCustomizedButtons";
import { useProductDetailsQuery } from "@/redux/api/productAPI";
import { RootState } from "@/redux/store";
import { CustomError } from "@/types/api-types";
import { CartItem } from "@/types/types";

// Helper components for Carousel
const NextButton: CarouselButtonType = ({ onClick }) => (
    <button onClick={onClick} className="carouselBtn">
        <FaArrowRightLong />
    </button>
);
const PrevButton: CarouselButtonType = ({ onClick }) => (
    <button onClick={onClick} className="carouselBtn">
        <FaArrowLeftLong />
    </button>
);

const ProductDetails = ({ params }: { params: Promise<{ id: string }> }) => {
    // Unwrap params using React.use()
    const { id } = use(params);
    const router = useRouter();

    const {
        data: productData,
        isLoading: isProductLoading,
        isError: isProductError,
        error: productError,
    } = useProductDetailsQuery(id);

    useEffect(() => {
        if (isProductError || productError) {
            const err = productError as CustomError;
            err.data?.message
                ? toast.error(err.data.message)
                : toast.error("Failed to fetch product details");
        }
    }, [isProductError, productError]);

    if (isProductError || productError) {
        // router.push("/"); // Handling redirect in effect is usually safer to avoid clashes
        // return null; 
    }

    const [carouselOpen, setCarouselOpen] = useState<boolean>(false);

    return (
        <div className="productDetails">
            {isProductLoading ? (
                <ProductLoader />
            ) : (
                <>
                    <main>
                        <section>
                            <Slider
                                objectFit="scale-down"
                                onClick={() => setCarouselOpen(true)}
                                images={
                                    productData?.product.photos.map((photo) => photo.url) || []
                                }
                                showThumbnails
                                showDots
                                PrevIcon={
                                    <span className="carouselBtn">
                                        <FaArrowLeftLong />
                                    </span>
                                }
                                NextIcon={
                                    <span className="carouselBtn">
                                        <FaArrowRightLong />
                                    </span>
                                }
                            />
                            {carouselOpen && (
                                <MyntraCarousel
                                    darkMode={true}
                                    objectFit="scale-down"
                                    NextButton={NextButton}
                                    PrevButton={PrevButton}
                                    setIsOpen={setCarouselOpen}
                                    images={
                                        productData?.product.photos.map((photo) => photo.url) || []
                                    }
                                />
                            )}
                        </section>
                        {productData ? (
                            <section>
                                <div>
                                    <code>{productData.product.category}</code>
                                    <em
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                        }}
                                    >
                                        <Ratings value={productData.product.averageRating} />
                                        {productData.product.numOfReviews} Reviews
                                    </em>
                                    <h3>₹{productData.product.price}</h3>
                                </div>
                                <h1>{productData.product.name}</h1>

                                <ReviewCustomizedButtons product={productData.product} />
                                <p>{productData.product.description}</p>
                            </section>
                        ) : null}
                    </main>
                </>
            )}
            <ReviewCard productId={id} />
        </div>
    );
};

export default ProductDetails;
