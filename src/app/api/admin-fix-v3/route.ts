
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { redis } from "@/lib/redis"; // Direct redis access to delete key
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectDB();

        const userId = "C3ODnFNCqnWsS2Jx9SgNAJGcdc32";
        const key = `user-${userId}`;

        // 1. Delete Cache
        await redis.del(key);
        console.log(`Cache key ${key} deleted.`);

        // 2. Fetch User to verify DB state and re-cache (if logic allows, but here just verify)
        const user = await User.findById(userId);

        return NextResponse.json({
            success: true,
            message: `Cache cleared for ${key}`,
            dbRole: user?.role,
            userFromDB: user
        }, { status: 200 });

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
