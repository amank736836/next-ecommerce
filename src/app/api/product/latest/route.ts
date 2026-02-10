import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Product } from "@/models/product";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectDB();

        let products;

        const key = "latest-products-v2";

        const cachedData = await redis.get(key);

        if (cachedData) {
            products = JSON.parse(cachedData);
        } else {
            products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
            await redis.set(key, JSON.stringify(products));
        }

        return NextResponse.json(
            {
                success: true,
                products,
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
