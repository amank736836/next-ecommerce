import { connectDB } from "@/lib/db";
import { Product } from "@/models/product";
import { Review } from "@/models/review";
import { User } from "@/models/user";
import { invalidateCache } from "@/utils/backend-features";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const { comment, rating, productId } = await req.json();

        const userId = req.nextUrl.searchParams.get("id");
        if (!userId) {
            return NextResponse.json({ success: false, message: "Please login to review" }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        let review = await Review.findOne({ user: userId, product: productId });

        if (review) {
            product.ratings -= review.rating;
            review.rating = rating;
            review.comment = comment;
            await review.save();
            product.ratings += rating;
        } else {
            await Review.create({
                user: userId,
                product: productId,
                comment,
                rating,
            });
            product.ratings += rating;
            product.numOfReviews += 1;
        }

        product.averageRating = Math.floor(product.ratings / product.numOfReviews);

        await product.save();

        await invalidateCache({
            product: true,
            productId: String(product._id),
            admin: true,
            review: true,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Review Posted Successfully",
            },
            { status: 201 }
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
