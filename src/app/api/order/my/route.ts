import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Order } from "@/models/order";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter a user id",
                },
                { status: 400 }
            );
        }

        let orders = [];

        const key = `my-orders-${id}`;

        const cachedData = await redis.get(key);

        if (cachedData) {
            orders = JSON.parse(cachedData);
        } else {
            orders = await Order.find({ user: id });
            await redis.set(key, JSON.stringify(orders));
        }

        return NextResponse.json(
            {
                success: true,
                orders,
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
