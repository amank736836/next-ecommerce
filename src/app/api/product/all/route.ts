import { connectDB } from "@/lib/db";
import { Product } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") || "";
        const price = searchParams.get("price") || "";
        const category = searchParams.get("category") || "";
        const sort = searchParams.get("sort") || "";
        const page = Number(searchParams.get("page")) || 1;

        const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
        const skip = (page - 1) * limit;

        const baseQuery: any = {};

        if (search) {
            baseQuery.name = {
                $regex: search,
                $options: "i",
            };
        }

        if (price) {
            baseQuery.price = {
                $lte: Number(price),
            };
        }

        if (category) {
            baseQuery.category = category;
        }

        const productsPromise = Product.find(baseQuery);

        if (sort) {
            productsPromise.sort({ price: sort === "asc" ? 1 : -1 });
        } else {
            productsPromise.sort({ createdAt: -1 });
        }

        productsPromise.limit(limit).skip(skip);

        const [products, filteredOnlyProduct] = await Promise.all([
            productsPromise,
            Product.find(baseQuery),
        ]);

        const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

        return NextResponse.json(
            {
                success: true,
                products,
                totalPage,
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
