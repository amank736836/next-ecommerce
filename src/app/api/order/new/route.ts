import { connectDB } from "@/lib/db";
import { Order } from "@/models/order";
import { reduceStock, invalidateCache, OrderItemType } from "@/utils/backend-features";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const {
            shippingInfo,
            orderItems,
            user,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total,
        } = await req.json();

        if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter all fields",
                },
                { status: 400 }
            );
        }

        await reduceStock(orderItems);

        const order = await Order.create({
            shippingInfo,
            orderItems,
            user,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total,
        });

        await invalidateCache({
            product: true,
            order: true,
            admin: true,
            userId: user,
            productId: order.orderItems.map((i: OrderItemType) => String(i.productId)),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Order placed successfully",
                orderId: order._id,
            },
            { status: 201 }
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
