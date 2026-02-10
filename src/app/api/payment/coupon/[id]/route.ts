import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/coupon";
import { User } from "@/models/user";
import { invalidateCache } from "@/utils/backend-features";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();
        const { id } = await params;

        const authId = req.nextUrl.searchParams.get("id");
        if (!authId) {
            return NextResponse.json({ success: false, message: "Please provide admin id" }, { status: 401 });
        }

        const user = await User.findById(authId);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 403 });
        }

        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
        }

        return NextResponse.json(
            {
                success: true,
                coupon,
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
        const { id: couponId } = await params;

        const id = req.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, message: "Please provide admin id" }, { status: 401 });
        }

        const user = await User.findById(id);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 403 });
        }

        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
        }

        const { code, amount } = await req.json();

        if (code) coupon.code = code;
        if (amount) coupon.amount = amount;

        await coupon.save();

        await invalidateCache({ coupon: true, couponId });

        return NextResponse.json(
            {
                success: true,
                message: `Coupon ${coupon.code} Updated Successfully`,
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
        const { id: couponId } = await params;

        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Please provide admin id" }, { status: 401 });
        }

        const user = await User.findById(id);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 403 });
        }

        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
        }

        await coupon.deleteOne();

        await invalidateCache({ coupon: true, couponId });

        return NextResponse.json(
            {
                success: true,
                message: "Coupon Deleted Successfully",
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
