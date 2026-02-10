import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
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

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter a user id",
                },
                { status: 400 }
            );
        }

        let user;
        const key = `user-${id}`;
        const cachedData = await redis.get(key);

        if (cachedData) {
            user = JSON.parse(cachedData);
        } else {
            user = await User.findById(id);
            if (!user) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "User not found",
                    },
                    { status: 404 }
                );
            }
            await redis.set(key, JSON.stringify(user));
        }

        return NextResponse.json(
            {
                success: true,
                user,
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
        const adminId = req.nextUrl.searchParams.get("id");

        if (!adminId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please provide admin id",
                },
                { status: 401 }
            );
        }

        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not authorized",
                },
                { status: 403 }
            );
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        await user.deleteOne();
        await invalidateCache({ admin: true, userId: id });

        return NextResponse.json(
            {
                success: true,
                message: "User Deleted Successfully",
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

export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();
        const { id } = await params;
        const { role } = await req.json();

        const authId = req.nextUrl.searchParams.get("id");
        if (!authId) {
            return NextResponse.json({ success: false, message: "Please provide admin id" }, { status: 401 });
        }

        const user = await User.findById(authId);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 403 });
        }

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (role) targetUser.role = role;

        await targetUser.save();

        await invalidateCache({ admin: true, userId: id });

        return NextResponse.json(
            {
                success: true,
                message: "User Role Updated Successfully",
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


