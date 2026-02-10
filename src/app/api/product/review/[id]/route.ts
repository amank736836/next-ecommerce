import { connectDB } from "@/lib/db";
import { Product } from "@/models/product";
import { Review } from "@/models/review";
import { User } from "@/models/user";
import { invalidateCache } from "@/utils/backend-features";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();
        const { id } = await params;

        const reviews = await Review.find({ product: id })
            .sort({ updatedAt: -1 })
            .populate("user", "name photo");

        return NextResponse.json(
            {
                success: true,
                reviews,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();

        const { id: productId } = await params;
        const userId = req.nextUrl.searchParams.get("id");

        if (!userId) {
            return NextResponse.json({ success: false, message: "Please login to delete review" }, { status: 401 });
        }

        const baseQuery = { user: userId, product: productId };
        // Assuming 1 review per user per product logic from legacy/post
        const review = await Review.findOne(baseQuery);

        if (!review) {
            return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
        }

        // Check authorization: Admin or the review owner
        // Fetch user to check role
        const user = await User.findById(userId);

        // If user not found, 404
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        await review.deleteOne();

        // Update Product ratings
        const product = await Product.findById(productId);
        if (product) {
            product.ratings -= review.rating;
            product.numOfReviews -= 1;
            if (product.numOfReviews < 0) product.numOfReviews = 0; // Safety
            if (product.ratings < 0) product.ratings = 0;

            if (product.numOfReviews === 0) {
                product.averageRating = 0;
            } else {
                product.averageRating = Math.floor(product.ratings / product.numOfReviews);
            }
            await product.save();
        }

        await invalidateCache({
            product: true,
            productId: String(product?._id),
            admin: true,
            review: true,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Review Deleted Successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
};
