import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/coupon";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const code = searchParams.get("coupon");

        if (!code) {
            return NextResponse.json(
                { success: false, message: "Please enter coupon code" },
                { status: 400 }
            );
        }

        const discount = await Coupon.findOne({ code });

        if (!discount) {
            return NextResponse.json(
                { success: false, message: "Invalid Coupon Code" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                discount: discount.amount,
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
