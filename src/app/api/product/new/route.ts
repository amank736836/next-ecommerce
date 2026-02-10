import { connectDB } from "@/lib/db";
import { Product } from "@/models/product";
import { User } from "@/models/user";
import { invalidateCache, uploadToCloudinary } from "@/utils/backend-features";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const price = formData.get("price") as string;
        const stock = formData.get("stock") as string;
        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const photo = formData.get("photo") as File;
        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Please provide admin id" },
                { status: 401 }
            );
        }

        const user = await User.findById(id);
        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "You are not authorized" },
                { status: 403 }
            );
        }

        if (!photo) {
            return NextResponse.json(
                { success: false, message: "Please add photo" },
                { status: 400 }
            );
        }

        if (!name || !price || !stock || !category || !description) {
            return NextResponse.json(
                { success: false, message: "Please enter all fields" },
                { status: 400 }
            );
        }

        // Upload photo to Cloudinary
        const { public_id, url } = await uploadToCloudinary(photo);

        await Product.create({
            name,
            price: Number(price),
            stock: Number(stock),
            category: category.toLowerCase(),
            description,
            photos: [{ public_id, url }],
        });

        await invalidateCache({ product: true, admin: true });

        return NextResponse.json(
            {
                success: true,
                message: "Product Created Successfully",
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
