import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Product } from "@/models/product";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, message: "Please provide admin id" }, { status: 401 });
        }

        const user = await User.findById(id);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 403 });
        }

        let products;

        const key = "all-products";

        const cachedData = await redis.get(key);

        if (cachedData) {
            products = JSON.parse(cachedData);
        } else {
            products = await Product.find({});
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
