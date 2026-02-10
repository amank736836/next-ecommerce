import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Order } from "@/models/order";
import { Product } from "@/models/product";
import { User } from "@/models/user";
import { getChartData } from "@/utils/backend-features";
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

        let charts;
        const key = "admin-line-charts";

        const cachedData = await redis.get(key);

        if (cachedData) {
            charts = JSON.parse(cachedData);
        } else {
            const today = new Date();
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(today.getMonth() - 12);

            const baseQuery = {
                createdAt: {
                    $gte: twelveMonthsAgo,
                    $lte: today,
                },
            };

            const [products, users, orders] = await Promise.all([
                Product.find(baseQuery).select("createdAt"),
                User.find(baseQuery).select("createdAt"),
                Order.find(baseQuery).select("createdAt discount total status"),
            ]);

            const productCounts = getChartData({
                length: 12,
                today,
                docArr: products,
            });
            const userCounts = getChartData({
                length: 12,
                today,
                docArr: users,
            });
            const discount = getChartData({
                length: 12,
                today,
                property: "discount",
                docArr: orders,
            });
            const revenue = getChartData({
                length: 12,
                today,
                property: "total",
                docArr: orders,
            });

            charts = {
                users: userCounts,
                products: productCounts,
                discount,
                revenue,
            };

            await redis.set(key, JSON.stringify(charts));
        }

        return NextResponse.json(
            {
                success: true,
                charts,
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
