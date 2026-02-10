import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const { amount } = await req.json();

        if (!amount) {
            return NextResponse.json({ success: false, message: "Please enter amount" }, { status: 400 });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const payment = await razorpay.orders.create({
            amount: Number(amount * 100),
            currency: "INR",
        });

        return NextResponse.json(
            {
                success: true,
                clientSecret: payment.id,
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
