import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Order } from "@/models/order";
import { Product } from "@/models/product";
import { User } from "@/models/user";
import { calculatePercentage } from "@/utils/backend-features";
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

        let stats;
        const key = "admin-stats-frontend-v2";

        const cachedData = await redis.get(key);

        if (cachedData) {
            stats = JSON.parse(cachedData);
        } else {
            const today = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const thisMonth = {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: today,
            };

            const lastMonth = {
                start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                end: new Date(today.getFullYear(), today.getMonth(), 0),
            };

            const thisMonthProductsPromise = Product.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                },
            });

            const lastMonthProductsPromise = Product.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                },
            });

            const thisMonthUsersPromise = User.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                },
            });

            const lastMonthUsersPromise = User.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                },
            });

            const thisMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                },
            });

            const lastMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                },
            });

            const lastSixMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: sixMonthsAgo,
                    $lte: today,
                },
            });

            const latestTransactionsPromise = Order.find({})
                .select(["orderItems", "discount", "total", "status"])
                .limit(4);

            const [
                thisMonthProducts,
                thisMonthUsers,
                thisMonthOrders,
                lastMonthProducts,
                lastMonthUsers,
                lastMonthOrders,
                productsCount,
                usersCount,
                allOrders,
                lastSixMonthOrders,
                categories,
                femaleUsersCount,
                latestTransactions,
            ] = await Promise.all([
                thisMonthProductsPromise,
                thisMonthUsersPromise,
                thisMonthOrdersPromise,
                lastMonthProductsPromise,
                lastMonthUsersPromise,
                lastMonthOrdersPromise,
                Product.countDocuments(),
                User.countDocuments(),
                Order.find({}).select("total"),
                lastSixMonthOrdersPromise,
                Product.distinct("category"),
                User.countDocuments({ gender: "female" }),
                latestTransactionsPromise,
            ]);

            const thisMonthRevenue = thisMonthOrders.reduce(
                (total, order) => total + (order.total || 0),
                0
            );

            const lastMonthRevenue = lastMonthOrders.reduce(
                (total, order) => total + (order.total || 0),
                0
            );

            const changePercent = {
                revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
                product: calculatePercentage(
                    thisMonthProducts.length,
                    lastMonthProducts.length
                ),
                user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
                order: calculatePercentage(
                    thisMonthOrders.length,
                    lastMonthOrders.length
                ),
            };

            const revenue = allOrders.reduce(
                (total, order) => total + (order.total || 0),
                0
            );

            const count = {
                revenue,
                product: productsCount,
                user: usersCount,
                order: allOrders.length,
            };

            const orderMonthCounts = new Array(6).fill(0);
            const orderMonthRevenue = new Array(6).fill(0);

            lastSixMonthOrders.forEach((order) => {
                const creationDate = new Date(order.createdAt as unknown as string);
                const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

                if (monthDiff < 6) {
                    orderMonthCounts[6 - 1 - monthDiff] += 1;
                    orderMonthRevenue[6 - 1 - monthDiff] += order.total;
                }
            });

            const categoryCount: Record<string, number>[] = [];

            const categoriesCountPromise = categories.map((category) =>
                Product.countDocuments({ category })
            );

            const categoriesCount = await Promise.all(categoriesCountPromise);

            categories.forEach((category, i) => {
                categoryCount.push({
                    [category]: Math.round((categoriesCount[i] / productsCount) * 100),
                });
            });

            const userRatio = {
                male: usersCount - femaleUsersCount,
                female: femaleUsersCount,
            };

            stats = {
                categoryCount,
                changePercent: {
                    revenue: changePercent.revenue,
                    products: changePercent.product,
                    users: changePercent.user,
                    orders: changePercent.order,
                },
                count: {
                    revenue: count.revenue,
                    products: count.product,
                    users: count.user,
                    orders: count.order,
                },
                chart: {
                    order: orderMonthCounts,
                    revenue: orderMonthRevenue,
                },
                userRatio,
                latestOrders: latestTransactions,
            };

            await redis.set(key, JSON.stringify(stats));
        }

        return NextResponse.json(
            {
                success: true,
                stats,
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
