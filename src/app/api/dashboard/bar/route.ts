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
        const key = "admin-bar-charts";

        const cachedData = await redis.get(key);

        if (cachedData) {
            charts = JSON.parse(cachedData);
        } else {
            const today = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(today.getMonth() - 6);
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(today.getMonth() - 12);

            const sixMonthsProductsPromise = Product.find({
                createdAt: {
                    $gte: sixMonthsAgo,
                    $lte: today,
                },
            }).select("createdAt");

            const sixMonthsUsersPromise = User.find({
                createdAt: {
                    $gte: sixMonthsAgo,
                    $lte: today,
                },
            }).select("createdAt");

            const twelveMonthsOrdersPromise = Order.find({
                createdAt: {
                    $gte: twelveMonthsAgo,
                    $lte: today,
                },
            }).select("createdAt");

            const [products, users, orders] = await Promise.all([
                sixMonthsProductsPromise,
                sixMonthsUsersPromise,
                twelveMonthsOrdersPromise,
            ]);

            const productCounts = getChartData({ length: 6, today, docArr: products });
            const userCounts = getChartData({ length: 6, today, docArr: users });
            const orderCounts = getChartData({ length: 12, today, docArr: orders });

            charts = {
                users: userCounts,
                products: productCounts,
                orders: orderCounts,
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
