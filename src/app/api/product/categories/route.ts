import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Product } from "@/models/product";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectDB();

        let categories;

        const key = "categories";

        const cachedData = await redis.get(key);

        if (cachedData) {
            categories = JSON.parse(cachedData);
        } else {
            categories = await Product.distinct("category");
            await redis.set(key, JSON.stringify(categories));
        }

        return NextResponse.json(
            {
                success: true,
                categories,
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
