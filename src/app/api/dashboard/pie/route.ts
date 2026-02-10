import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Order } from "@/models/order";
import { Product } from "@/models/product";
import { User } from "@/models/user";
import { getCategoriesCount } from "@/utils/backend-features";
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
        const key = "admin-pie-charts";

        const cachedData = await redis.get(key);

        if (cachedData) {
            charts = JSON.parse(cachedData);
        } else {
            const allOrdersPromise = Order.find({}).select([
                "total",
                "discount",
                "subtotal",
                "tax",
                "shippingCharges",
                "status",
            ]);

            const [
                processingOrder,
                shippedOrder,
                deliveredOrder,
                categories,
                productsCount,
                outOfStock,
                allOrders,
                allUsers,
                adminUsers,
                customerUsers,
            ] = await Promise.all([
                Order.countDocuments({ status: "Processing" }),
                Order.countDocuments({ status: "Shipped" }),
                Order.countDocuments({ status: "Delivered" }),
                Product.distinct("category"),
                Product.countDocuments(),
                Product.countDocuments({ stock: 0 }),
                allOrdersPromise,
                User.find({}).select(["dob"]),
                User.countDocuments({ role: "admin" }),
                User.countDocuments({ role: "user" }),
            ]);

            const orderFullfillment = {
                processing: processingOrder,
                shipped: shippedOrder,
                delivered: deliveredOrder,
            };

            const productCategories = await getCategoriesCount({
                categories,
                productCount: productsCount,
            });

            const stockAvailability = {
                inStock: productsCount - outOfStock,
                outOfStock,
            };

            const grossIncome = allOrders.reduce(
                (prev, order) => prev + (order.total || 0),
                0
            );

            const discount = allOrders.reduce(
                (prev, order) => prev + (order.discount || 0),
                0
            );

            const productionCost = allOrders.reduce(
                (prev, order) => prev + (order.shippingCharges || 0),
                0
            );

            const burnt = allOrders.reduce(
                (prev, order) => prev + (order.tax || 0),
                0
            );

            const marketingCost = Math.round(grossIncome * (30 / 100));

            const netMargin =
                grossIncome - discount - productionCost - burnt - marketingCost;

            const revenueDistribution = {
                netMargin,
                discount,
                productionCost,
                burnt,
                marketingCost,
            };

            const usersAgeGroup = {
                teen: allUsers.filter((i) => i.age < 20).length,
                adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
                old: allUsers.filter((i) => i.age >= 40).length,
            };

            const adminCustomer = {
                admin: adminUsers,
                customer: customerUsers,
            };

            charts = {
                orderFullfillment,
                productCategories,
                stockAvailability,
                revenueDistribution,
                usersAgeGroup,
                adminCustomer,
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
