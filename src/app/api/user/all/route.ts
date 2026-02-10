import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please provide admin id",
                },
                { status: 401 }
            );
        }

        const admin = await User.findById(id);

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found (Admin)",
                },
                { status: 401 }
            );
        }

        if (admin.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not authorized",
                },
                { status: 403 }
            );
        }

        let users = [];

        const key = "all-users";
        const cachedData = await redis.get(key);

        if (cachedData) {
            users = JSON.parse(cachedData);
        } else {
            users = await User.find();
            await redis.set(key, JSON.stringify(users));
        }

        return NextResponse.json(
            {
                success: true,
                users,
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
