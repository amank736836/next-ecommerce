import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/order";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            await req.json();

        if (
            !razorpay_payment_id ||
            !razorpay_order_id ||
            !razorpay_signature
        ) {
            return NextResponse.json(
                { success: false, message: "Payment Verification Failed" },
                { status: 400 }
            );
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Payment Verified
            // Here we could store payment details or update order if order was already created
            // But typically order creation happens separately. 
            // We just need to return success.
            return NextResponse.json(
                {
                    success: true,
                    message: "Payment Verified Successfully",
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Payment Verification Failed" },
                { status: 400 }
            );
        }
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
