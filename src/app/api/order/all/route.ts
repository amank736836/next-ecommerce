import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Order } from "@/models/order";
import { User } from "@/models/user";
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
                    message: "Please enter admin id",
                },
                { status: 400 }
            );
        }

        const admin = await User.findById(id);

        if (!admin || admin.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not authorized",
                },
                { status: 403 }
            );
        }

        let orders = [];

        const key = `all-orders`;

        const cachedData = await redis.get(key);

        if (cachedData) {
            orders = JSON.parse(cachedData);
        } else {
            orders = await Order.find().populate("user", "name");
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
