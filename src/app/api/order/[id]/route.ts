import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Order } from "@/models/order";
import { Payment } from "@/models/payment";
import { Product } from "@/models/product";
import { User } from "@/models/user";
import { invalidateCache, OrderItemType } from "@/utils/backend-features";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();
        const { id } = await params;
        const key = `order-${id}`;

        let order;
        const cachedData = await redis.get(key);

        if (cachedData) {
            order = JSON.parse(cachedData);
        } else {
            order = await Order.findById(id).populate("user", "name");
            if (!order) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Order not found",
                    },
                    { status: 404 }
                );
            }
            await redis.set(key, JSON.stringify(order));
        }

        return NextResponse.json(
            {
                success: true,
                order,
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

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();
        const { id } = await params;

        // Check Admin
        const userId = req.nextUrl.searchParams.get("id");
        if (!userId) {
            return NextResponse.json({ success: false, message: "Please provide admin id" }, { status: 401 });
        }
        const user = await User.findById(userId);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 403 });
        }

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found",
                },
                { status: 404 }
            );
        }

        switch (order.status) {
            case "Processing":
                order.status = "Shipped";
                break;
            case "Shipped":
                order.status = "Delivered";
                break;
            default:
                order.status = "Delivered";
                break;
        }

        await order.save();

        await invalidateCache({
            product: false,
            order: true,
            admin: true,
            userId: order.user,
            orderId: String(order._id),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Order Processed Successfully",
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

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();
        const { id } = await params;

        const userId = req.nextUrl.searchParams.get("id");
        if (!userId) {
            return NextResponse.json({ success: false, message: "Please provide admin id" }, { status: 401 });
        }
        const user = await User.findById(userId);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 403 });
        }

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found",
                },
                { status: 404 }
            );
        }

        await order.deleteOne();

        await invalidateCache({
            product: false,
            order: true,
            admin: true,
            userId: order.user,
            orderId: String(order._id),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Order Deleted Successfully",
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

export const POST = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();
        const { id } = await params;

        const userId = req.nextUrl.searchParams.get("id");
        if (!userId) {
            return NextResponse.json({ success: false, message: "Please login" }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found",
                },
                { status: 404 }
            );
        }

        if (user.role !== "admin" && order.user.toString() !== userId) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
        }

        if (order.status === "Shipped" || order.status === "Delivered") {
            return NextResponse.json({ success: false, message: "Cannot cancel order that is already shipped or delivered" }, { status: 400 });
        }

        await order.deleteOne();

        await invalidateCache({
            product: false,
            order: true,
            admin: true,
            userId: order.user,
            orderId: String(order._id),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Order Cancelled Successfully",
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
