import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { invalidateCache } from "@/utils/backend-features";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const { name, email, photo, gender, _id, dob } = await req.json();

        if (!_id || !name || !email || !photo) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter all fields (ID, Name, Email, Photo)",
                },
                { status: 400 }
            );
        }

        let user = await User.findById(_id);

        if (user) {
            return NextResponse.json(
                {
                    success: true,
                    message: `Welcome, ${user.name}`,
                },
                { status: 200 }
            );
        }

        if (!gender || !dob) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter all fields",
                },
                { status: 400 }
            );
        }

        // Role check logic from backend
        // user = await User.create({ ... })
        // But first existing user check to assign admin role?
        // Wait, backend logic was: const users = await User.find(); role: users.length === 0 ? "admin" : "user"

        // Optimizing to count instead of finding all documents
        const userCount = await User.countDocuments();

        user = await User.create({
            name,
            email,
            photo,
            gender,
            _id,
            dob,
            role: userCount === 0 ? "admin" : "user",
        });

        await invalidateCache({ admin: true, userId: user._id });

        return NextResponse.json(
            {
                success: true,
                message: `Welcome, ${user.name}`,
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
