import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/coupon";
import { User } from "@/models/user";
import { invalidateCache } from "@/utils/backend-features";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const { code, amount } = await req.json();
        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Please provide admin id" }, { status: 401 });
        }

        const user = await User.findById(id);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 403 });
        }

        if (!code || !amount) {
            return NextResponse.json(
                { success: false, message: "Please enter both coupon and amount" },
                { status: 400 }
            );
        }

        await Coupon.create({ code, amount });

        await invalidateCache({ coupon: true });

        return NextResponse.json(
            {
                success: true,
                message: `Coupon ${code} Created Successfully`,
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
